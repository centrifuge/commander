/* eslint-disable prettier/prettier */
//import { ApiPromise, WsProvider } from '@polkadot/api';
import { Hash, BlockHash, SignedBlock } from '@polkadot/types/interfaces';
import { PolkadotClient } from './client.js';
import chalk from 'chalk';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';


/**
 * Reward claims migrator class.
 *
 * This class is used for extracting unclaimed rewards from Centrifuge chain to parachain.
 */
export class ClaimsCommandController {
  private chainClient!: PolkadotClient;
  private parachainClient!: PolkadotClient;

  // Build a new reward claims controller
  constructor() {
    // nothing to do folks !!!
  }

  // Default chain and parachain endpoints
  public static FULLNODE_CENTRIFUGE_CHAIN_URL = 'wss://fullnode-archive.centrifuge.io';
  public static LOCAL_CENTRIFUGE_PARACHAIN_COLLATOR_URL = 'ws://127.0.0.1:9946';

  // Name of the pallet (on Centrifuge chain) which process Tinlake reward claims
  private static PALLET_CLAIMS = 'radClaims';
  private static METHOD_STORE_ROOT_HASH = 'storeRootHash';

  // --------------------------------------------------------------------------------------------
  // Public methods
  // --------------------------------------------------------------------------------------------

  /**
   * Open the connections to source chain and target parachain (eventually providing a seed account).
   *
   * Connections to the source chain and the target parachain are opened. An optional seed
   * can be provided so that to set the keyring for later transactions on the parachain.
   *
   * @param fromUrl Websocket URL of the source chain (e.g. 'wss://fullnode-archive.centrifuge.io').
   * @param toUrl   Websocket URL of the target parachain (collator node).
   * @param seed    Seed account to be used to establish transactions with the target parachain (e.g. '//Alice').
   */
  async connect(fromUrl: string, toUrl: string, seed: string) {

    // Open the connection to source chain
    this.chainClient = await PolkadotClient.connect(fromUrl);

    // Retrieve chain and node information
    const [chain, chainNode] = await Promise.all([
      this.chainClient.api.rpc.system.chain(),
      this.chainClient.api.rpc.system.name(),
    ]);

    // eslint-disable-next-line prettier/prettier
    console.log(`  ... ${chalk.greenBright('✓')} connected to chain '${chalk.blueBright(chain)}' on node '${chalk.blueBright(chainNode)}'`);

    // Open a connection on the target parachain
    this.parachainClient = await PolkadotClient.connect(toUrl);

    // Retrieve parachain and parachain node information
    const [collator, collatorNode] = await Promise.all([
      this.parachainClient.api.rpc.system.chain(),
      this.parachainClient.api.rpc.system.name(),
    ]);

    // eslint-disable-next-line prettier/prettier
    console.log(`  ... ${chalk.greenBright('✓')} connected to parachain '${chalk.blueBright(collator)}' on node '${chalk.blueBright(collatorNode)}' with seed ${chalk.blueBright(seed)}`);

    // Add a new keyring pair for the given raw seed to the keyring dictionary
    const seedAccount = this.parachainClient.addKeyringPair(seed);

    // Authenticates the current sudo key and sets the given seed account as the new Sudo
    this.parachainClient.api.tx.sudo.setKey(seedAccount.address);

    // Get the current sudo key in the system
    const sudoKey = await this.parachainClient.api.query.sudo.key();
    if (sudoKey.toString() === seedAccount.address) {
      console.log(`  ... ${chalk.greenBright('✓')} parachain Sudo key set to account ${chalk.blueBright(seed)}`);
    } else {
      // eslint-disable-next-line prettier/prettier
      console.log(`  >>> [${chalk.redBright('ERROR')}] cannot set parachain Sudo key to ${chalk.blueBright(seedAccount.address)}`);
    }
  }

  // Close connections to source chain and target parachain
  async disconnect() {
    if (this.chainClient) await this.chainClient.disconnect();
    if (this.parachainClient) await this.parachainClient.disconnect();
  }

  // Extract unclaimed rewards from a given root hash
  //
  // Command: node packages/cli/bin/run migration
  //   wss://fullnode-archive.centrifuge.io
  //   wss://fullnode-collator.charcoal.centrifuge.io
  //   -b 6650470
  //   --config /Users/frederik/.cfgCli/Migration/altair-migration.json
  //   --creds /Users/frederik/.cfgCli/Migration/creds.json
  //   --dry-run
  // @param fromBlockNumber Number of the block where the latest call to 'radclaims(RootHashStored) was done.
  async migrate(fromBlockNumber: string): Promise<void> {
    if (!this.chainClient || !this.parachainClient) return;

    console.log('');
    console.log(`Call ${chalk.blueBright('ClaimsCommandController.migrate')} method`);
    console.log('');

    try {
      // Extract block hash from the input block number
      const blockHash: BlockHash = await this.chainClient.api.rpc.chain.getBlockHash(fromBlockNumber);
      console.info(`  ... ${chalk.greenBright('✓')} checked input block number ${chalk.blueBright(fromBlockNumber)}`);
//      console.info(`        > input block hash: ${chalk.blueBright(blockHash.toHex())}`);

      // Get signed block
      const signedBlock: SignedBlock = await this.chainClient.api.rpc.chain.getBlock(blockHash);

      // Scan block's extrinsics so that to track the one triggering 'radclaims(store_root_hash)' action
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      signedBlock.block.extrinsics.forEach(async (extrinsic, _) => {
        const {
          method: { args, method, section },
        } = extrinsic;

        if (
          section === ClaimsCommandController.PALLET_CLAIMS &&
          method === ClaimsCommandController.METHOD_STORE_ROOT_HASH
        ) {
          // Get method's 'root_hash' parameter
          const rootHashValue = args[0];

          // eslint-disable-next-line prettier/prettier
          console.info(`  ... ${chalk.greenBright('✓')} latest ${chalk.blueBright('radClaims(store_root_hash)')} root_hash value is ${chalk.blueBright(rootHashValue)}`);

/*
          console.log(`      > extrinsic id ${fromBlockNumber}-${index}`);
          console.log(`        hash:        ${extrinsic.hash.toHex()}`);
          console.log(`        tx pallet:   ${section}`);
          console.log(`        tx method:   ${method}`);
          console.log(`        tx roothash: ${rootHash.toString()}`);
          console.log(`        meta:        ${meta.toString()}`);

          console.log(`        ${section}.${method}(${args.map(a => a.toString()).join(', ')})`);
          if (isSigned) {
            console.log(`        signer:     ${extrinsic.signer.toString()}, nonce=${extrinsic.nonce.toString()}`);
          }
*/
          // Migrate root hash (containing latest reward claims) to the target parachain
          await this.migrateRootHash(rootHashValue as Hash);
          await this.setBalance();
        }
      });
    } catch (error) {
      console.error(`Error`);
    } finally {
      console.log(`  ... rewards ${chalk.greenBright('successfully')} transferred to parachain`);
    }
  }

  // --------------------------------------------------------------------------------------------
  // Private methods
  // --------------------------------------------------------------------------------------------

  /*
   * Migrate the given root hash to the target parachain.
   *
   * The root hash accumulates reward claims. Consequently, only the latest block which called
   * the 'radClaims.storeRootHash(root_hash)' transaction must be taken into account to get the
   * 'rootHash' value that is passed to this method.
   * A Sudo transaction is used behind the scene.
   *
   * @param rootHash Latest root hash that is stored in 'radClaims'
   */
  private async migrateRootHash(rootHash: Hash): Promise<void> {
    return;

    if (this.parachainClient === undefined) return;

    // Initialise the provider to connect to the local node
    const provider = new WsProvider('ws://127.0.0.1:9944');

    // Create the API and wait until ready (optional provider passed through)
    const api = await ApiPromise.create({ provider });

    const keyring = new Keyring({ type: 'sr25519' });
    const keyringPair = keyring.addFromUri('//Alice');

    // Retrieve the upgrade key from the chain state
    //const sudoKey = await api.query.sudo.key();

    // Get current sudo key in the system
    //    const sudoKey = await this.parachainClient.api.query.sudo.key();

    console.log(`  ... sudo key is ${keyringPair.address}`);

    // Lookup from keyring (assuming we have added all, on --dev this would be `//Alice`)
    // const sudoKeyAccount = this.parachainClient.getKeyringPair(sudoKey.toString());

    // Create transaction for setting storage state
    const transaction = api.tx.system.setStorage(rootHash);

    // Perform actual storage transaction via the Sudo module
    // eslint-disable-next-line prettier/prettier
    const unsub = await api.tx.sudo
      .sudo(transaction)
      .signAndSend(keyringPair, ({ events = [], status }) => {
        console.log(`Transaction status ${chalk.greenBright(status)}`);

        if (status.isInBlock) {
          console.error('You have just upgraded your chain');

          console.log('Included at block hash', status.asInBlock.toHex());
          console.log('Events:');

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          console.log(JSON.stringify(events.toString(), null, 2));

          // @ts-ignore
          unsub();
        }
      })
      .catch(err => console.log(err));
  }

  private async setBalance(): Promise<void> {
    // Initialise the provider to connect to the local node
    const provider = new WsProvider('ws://127.0.0.1:9944');

    // Create the API and wait until ready (optional provider passed through)
    const api = await ApiPromise.create({ provider });

    const keyring = new Keyring({ type: 'sr25519' });
    const keyringPair = keyring.addFromUri('//Alice');
    
    const transaction = api.tx.balances.setBalance(PolkadotClient.BOB_ADDRESS, 5000, 2000);

    // eslint-disable-next-line prettier/prettier
    const unsub = await api.tx.sudo
      .sudo(transaction)
      .signAndSend(keyringPair, ({ status, events }) => {
        if (status.isInBlock || status.isFinalized) {
          console.log(`Balance set successfully`);
        }
        unsub();
    });
  }
}
