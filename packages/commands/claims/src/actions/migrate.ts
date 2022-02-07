import { BaseCommand } from '@centrifuge-commander/core/command';
//import colors from '@centrifuge-commander/core/colors.js';
//import { cli } from 'cli-ux';

/*
 * Migrate claims command options.
 */
interface MigrateClaimsCommandOptions {
  config?: string;
  fromUrl: string;
  toUrl: string;
  fromBlock: string;
}

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
      .addHelpText(
        'after',
        `
  Examples:
    $ centrifuge claims migrate --from_url --to_url --from_blockconfig ./standalone-chain.json`,
      )
      .action(this.execute.bind(this));
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
   * @param {string} chain Argument containing the name of the chain to be started.
   * @param {ChainStartCommandOptions} options List of options passed at command-line.
   */
  private execute(fromUrl: string, toUrl: string, fromBlock: string, options: MigrateClaimsCommandOptions): void {
    console.log(`  from URL:  ${fromUrl}`);
    if (options.config) {
      console.log(`  config file: ${options.config}`);
    }
  }
}
