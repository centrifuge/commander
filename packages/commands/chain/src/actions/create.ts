import { BaseCommand } from '@centrifuge-cli/core/command';
//import colors from '@centrifuge-cli/core/colors.js';
//import { cli } from 'cli-ux';

/*
 * Create chain command options.
 */
interface ChainCreateCommandOptions {
  config?: string;
}

/**
 * Create chain command class.
 *
 * This command is used for creating a new chain configuration.
 */
export class ChainCreateCommand extends BaseCommand {
  /**
   * Build a new subcommand instance.
   *
   * @param {string} name A string containing the name of the command ('chain' by default).
   */
  constructor(name?: string) {
    super(name === undefined ? 'create' : name);
  }

  /**
   * Initialize command options and arguments.
   */
  protected initialize(): void {
    this.description('Create a new chain')
      .addHelpText(
        'after',
        `
  Examples:
    $ centrifuge chain create --config ./standalone-chain.json"
    $ centrifuge chain create --name standalone-chain --source repository --flavor`,
      )
      .action(this.execute.bind(this));
  }

  /**
   * Handle command auto-completion.
   */
  protected autocomplete(): void {
    console.log('Chain create command does not implement auto-completion for now');
  }

  /*
   * Handle command action.
   *
   * @param {string} chain Argument containing the name of the chain to be started.
   * @param {ChainStartCommandOptions} options List of options passed at command-line.
   */
  private execute(chain: string, options: ChainCreateCommandOptions): void {
    console.log(`  chain name:  ${chain}`);
    if (options.config) {
      console.log(`  config file: ${options.config}`);
    }
  }
}
