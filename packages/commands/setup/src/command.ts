import { BaseCommand } from '@centrifuge-cli/core/command';
import { SetupShowCommand } from './actions/show.js';

/**
 * Application setup command class.
 *
 * When starting your journey with the Centrifuge CLI, a seminal setup is executed,
 * so that to define preferences and parameters, including, for instance, the credentials
 * for accessing the targeted cloud provider where to deploy your development playground(s)
 * or testing/bencharking networks (i.e. relay chain, parachains, collator nodes and so on),
 * the credentials for accessing Github repositories of Centrifuge components, and more.
 * This command can of course, be executed at any time to modify the settings.
 * Settings are stored in a hidden folder in user's home directory, such as, for instance,
 * '${HOME}/.centrifuge' on Unix flavors.
 *
 * Usage:
 * This command can be used to modify a particular setting, as shown below:
 *
 * $ centrifuge setup set [item] [value]
 *
 * The first time you land and start working with Centrifuge CLI, this command can be invoked as 
 * follows, so that to launch a setup wizard that will guide you step-by-step through a seminal
 * configuration process:
 *
 * $ centrifuge setup
 *
 * Note that when launching Centrifuge CLI for the first time, it tries to detect if the application
 * went through a seminal configuration, and if not, is launching the aforementioned seminal configuration 
 * wizared.
 */
export class SetupCommand extends BaseCommand {
  /* private command attributes */
  private static readonly Name = 'setup';
  private static readonly Description = 'Set application parameters and preferences (e.g. credentials, logs, ...).';

  /**
   * Builds a new setup command instance.
   *
   * @param {string} name A string containing the name of the command (default is 'setup').
   */
  constructor(name?: string) {
    super(name === undefined ? SetupCommand.Name : name);
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
    this.description(SetupCommand.Description)
      .addHelpText(
        'after',
        `
Examples:
  $ centrifuge setup show
  $ centrifuge setup set language fr`,
      )
      .action(this.execute.bind(this))
      .addCommand(new SetupShowCommand());
  }

  /*
   * Handle command action.
   *
   * Default setup command does not take any options or parameters.
   */
  private execute(): void {
    
    console.log(`Execute setup command`);
  }
}
