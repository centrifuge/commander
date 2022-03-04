import { BaseCommand } from '@centrifuge-commander/core/command';
import { ClaimsCommandController, PolkadotClient } from '../packages/index.js';

/*
 * Migrate claims command options.
 */
// interface MigrateClaimsCommandOptions {
//   fromUrl?: string;
//   toUrl?: string;
//   fromBlock?: string;
// }

/**
 * Reward claims migration command class.
 *
 * This command is used for migrating Tinlake reward claims from the standalone Centrifuge chain
 * to a parachain, such as, for instance, a local collator node (during testing phase) or to
 * Altair (onboarded on Kusama testing relay chain).
 */
export class MigrateClaimsCommand extends BaseCommand {
  /**
   * Build a new subcommand instance.
   *
   * @param {string} name A string containing the name of the command.
   */
  constructor(name?: string) {
    super(name === undefined ? 'migrate' : name);
  }

  /**
   * Initialize command options and arguments.
   */
  protected initialize(): void {
    this.description('Migrate Tinlake reward claims from Centrifuge chain to a parachain')
      // eslint-disable-next-line prettier/prettier
      .option('-c, --config <filePath>', 'Path of a JSON/YAML configuration file (instead of using command-line options)')
      .requiredOption('-f, --from <wsUrl>', 'WebSocket URL of the source chain')
      .requiredOption('-t, --to <wsUrl>', 'WebSocket URL of the target parachain')
      // eslint-disable-next-line prettier/prettier
      .requiredOption('-b, --block <number>', 'Number of the block which stored the latest claims root hash on the source chain')
      .addHelpText(
        'after',
        `
  Examples:
    $ centrifuge claims migrate --from ws://localhost:9446 --to ws://localhost:9944 --block 655221`,
      )
      .action(() => {
        const options = this.opts();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.execute(options.from as string, options.to as string, options.block as string);
      });
//    .action(this.execute(this.opts().from, this.opts().to, this.opts().block).bind(this));
  }

  /**
   * Handle command auto-completion.
   */
  protected autocomplete(): void {
    console.log('Claims migration command does not implement auto-completion for now');
  }

  /*
   * Handle command action.
   *
   * @param {string} fromUrl Source chain's WebSocket URL.
   * @param {string} toUrl Target parachain's WebSocket URL.
   * @param {string} fromBlockNumber Number of the block where latest rootoptions List of options passed at command-line.
   */
  private async execute(fromUrl: string, toUrl: string, fromBlockNumber: string) {
    // eslint-disable-next-line prettier/prettier
    console.log(`Enter MigrateClaimsCommand.execute(fromUrl: ${fromUrl}, toUrl: ${toUrl}, fromBlockNumber: ${fromBlockNumber})`);

    const controller = new ClaimsCommandController();
    await controller.connect(fromUrl, toUrl, PolkadotClient.SEED_ALICE);
    await controller.migrate(fromBlockNumber);
    await controller.disconnect();
  }
}
