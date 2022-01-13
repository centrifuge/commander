import { BaseCommand } from '@centrifuge-cli/core/command';
//import colors from '@centrifuge-cli/core/colors.js';
//import { cli } from 'cli-ux';

/*
 * Start chain command options.
 */
interface ChainStartCommandOptions {
  config?: string;
}

/**
 * Start chain command class.
 *
 * This command is used for creating a new chain configuration.
 */
export class ChainStartCommand extends BaseCommand {
  /**
   * Build a new subcommand instance.
   *
   * @param {string} name A string containing the name of the command ('chain' by default).
   */
  constructor(name?: string) {
    super(name === undefined ? 'start' : name);
  }

  /**
   * Initialize command options and arguments.
   */
  protected initialize(): void {
    this.description('Start a chain given its name and a configuration file')
      .argument('<chain>')
      .option('-c, --config <filename>', 'configuration file (.json or .yaml)')
      .addHelpText(
        'after',
        `
  Examples:
    $ centrifuge chain start --config ./standalone-chain.json standalone-chain`,
      )
      .action(this.execute.bind(this));
  }

  /**
   * Handle command auto-completion.
   */
  protected autocomplete(): void {
    console.log('Chain start subcommand does not implement auto-completion for now');
  }

  /*
   * Handle command action.
   *
   * @param {string} chain Argument containing the name of the chain to be started.
   * @param {ChainStartCommandOptions} options List of options passed at command-line.
   */
  private execute(chain: string, options: ChainStartCommandOptions): void {
    console.log(`  chain name:  ${chain}`);
    if (options.config) {
      console.log(`  config file: ${options.config}`);
    }
  }
}
