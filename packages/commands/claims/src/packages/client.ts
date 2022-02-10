import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";
import chalk from 'chalk';

/**
 * Polkadot chain and parachain client class.
 *
 * This class helps setting up connections to the source chain and the target parachain.
 */
export class PolkadotClient {
  public provider: WsProvider;
  public api: ApiPromise;
  private keyring: Keyring;

  // Default seed accounts
  public static SEED_ALICE = '//Alice';
  public static SEED_BOB = '//Bob';

  // Alice and Bob account addresses (for testing purpose)
  public static ALICE_ADDRESS = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  public static BOB_ADDRESS = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

  /*
   * Build a new instance of Polkadot client
   *
   * A new instance is created using 'create' method.
   */
  private constructor(provider: WsProvider, api: ApiPromise) {
    this.api = api;
    this.provider = provider;
    this.keyring = new Keyring({ type: 'sr25519' });
  }

  /**
   * Create a new client to access a chain or parachain using WebSocket connection.
   *
   * Would be better to put this code in the constructor. However constructors do not allow
   * async methods to be invoked in their body.
   *
   * @param wsUrl Websocket URL to a chain or parachain (e.g. wss://localhost:9944)
   * @returns An new Polkadot client instance is returned
   */
  static async connect(wsUrl: string): Promise<PolkadotClient> {
    // Create connection provider
    const provider = new WsProvider(wsUrl);

    // Create API
    const api = await ApiPromise.create({ provider });

    return new PolkadotClient(provider, api);
  }

  /**
   * Close Websocket connections to the source chain and target parachain.
   */
  async disconnect(): Promise<void> {
    return this.api.disconnect();
  }

  /**
   * Return keyring dictionary.
   */
  public getKeyring(): Keyring {
    return this.keyring;
  }

  /**
   * Create a new keyring pair from an hexadecimal or string seed.
   *
   * @param fromUri A URI of an account (e.g. '//Alice' or hex string)
   * @see https://polkadot.js.org/docs/api/start/keyring
   */
  public addKeyringPair(seed: string): KeyringPair {
    const keyringPair = this.keyring.addFromUri(seed);

    // eslint-disable-next-line prettier/prettier
    console.log(`  ... ${chalk.greenBright('✓')} added seed account ${chalk.blueBright(seed)} to keyring dictionary with address ${chalk.blueBright(keyringPair.address)}`);

    return keyringPair;
  }

  /**
   * Get a keyring pair given a key (e.g. '//Alice')
   *
   * @return A new [KeyringPair] is returned
   */
  public getKeyringPair(fromKey: string | Uint8Array): KeyringPair {
    return this.keyring.getPair(fromKey);
  }

  /**
   * Remove a pair from keyring dictionary.
   *
   * This method removes a given public key or address from the keyring dictionary.
   *
   * @param Input address or public key to be removed from the keyring dictionary.
   */

  public removeKeyringPair(fromKey: string | Uint8Array) {
    this.keyring.removePair(fromKey);
  }
}
