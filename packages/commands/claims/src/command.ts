import { BaseCommand } from '@centrifuge-commander/core/command';
import { MigrateClaimsCommand } from './actions/migrate.js';

/**
 * Tinlake reward claims management command.
 *
 * This command is mainly used for migrating Tinlake reward claims from the standalone
 * Centrifuge chain to a parachain such as Altair or running locally.
 * 
 * ## Usage
 * This command is used as follows:
 */
export class ClaimsCommand extends BaseCommand {
  private static readonly Name = 'claims';
  private static readonly Description = 'Manage Tinlake reward claims (e.g. migration from Centriguge chain to a parachain)';

  /**
   * Builds a new chain command instance.
   *
   * @param {string} name A string containing the name of the command (default is 'chain').
   */
  constructor(name?: string) {
    super(name === undefined ? ClaimsCommand.Name : name);
  }

  /**
   * Handle command auto-completion.
   */
  public autocomplete(): void {
    console.log('Claims command does not implement auto-completion for now');
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
    this.description(ClaimsCommand.Description)
      .addHelpText(
        'after',
`
Examples:
  $ centrifuge claimsn migrate ...`,
      )
      .addCommand(new MigrateClaimsCommand());
  }
}
