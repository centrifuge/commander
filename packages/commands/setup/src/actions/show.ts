import { BaseCommand } from '@centrifuge-commander/core/command';

/*
 * Show setup command options.
 */
interface SetupShowCommandOptions {
  format?: 'table' | 'normal';
}

/**
 * Setup command action used to show current application configuration.
 *
 */
export class SetupShowCommand extends BaseCommand {
  /* private constants definition */
  private static readonly Name = 'show';
  private static readonly Description = 'Show application configuration';

  /**
   * Build a new subcommand instance.
   *
   * @param {string} name A string containing the name of the command ('show' by default).
   */
  constructor(name?: string) {
    super(name === undefined ? SetupShowCommand.Name : name);
  }

  /**
   * Initialize command options and arguments.
   */
  protected initialize(): void {
    this.description(SetupShowCommand.Description)
      .option('-f, --format <format>', "format for showing application settings (can be 'table' or 'normal'), list")
      .addHelpText(
        'after',
        `
  Examples:
    Display current application settings (using 'normal' format):
    $ centrifuge setup show

    Show current application settings in tabular form:
    $ centrifuge setup show --format table`,
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
   * @param {SetupShowCommandOptions} options List of options passed at command-line.
   */
  private execute(options: SetupShowCommandOptions): void {
    console.log(`  setup show: ${options.format}`);
  }
}
