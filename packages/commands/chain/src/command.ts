import { BaseCommand } from '@centrifuge-commander/core/command';
import { ChainCreateCommand } from './actions/create.js';
import { ChainStartCommand } from './actions/start.js';

/**
 * Chain management command.
 *
 * This command is used to manage the life-cycle of a typical Centrifuge network, made
 * up of Polkadot relay chain(s) with parachains, including validator and collator nodes.
 */
export class ChainCommand extends BaseCommand {
  private static readonly Name = 'chain';
  private static readonly Description = 'Manage a complete Centrifuge network (i.e. parachain, relay chain, ...)';

  /**
   * Builds a new chain command instance.
   *
   * @param {string} name A string containing the name of the command (default is 'chain').
   */
  constructor(name?: string) {
    super(name === undefined ? ChainCommand.Name : name);
  }

  /**
   * Handle command auto-completion.
   */
  public autocomplete(): void {
    console.log('Chain command does not implement auto-completion for now');
  }

  /*
   * Initialize the command options and arguments.
   *
   * This function builds command's actions (or subcommands) and bind
   * them to this parent command.
   * This protected method is invoked from the {BaseCommand} (super-class)
   * constructor.
   */
  protected initialize(): void {
    this.description(ChainCommand.Description)
      .addHelpText(
        'after',
`
Examples:
  $ centrifuge chain create ...
  $ centrifuge chain delete ...`,
      )
      .addCommand(new ChainCreateCommand())
      .addCommand(new ChainStartCommand());
  }
}
