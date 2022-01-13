/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Command } from 'commander';

/**
 * Command with auto-completion support.
 *
 * All command must inherit from this base command class. It provides
 * with auto-completion skeleton.
 */
export abstract class BaseCommand extends Command {
  /**
   * Build a new base command instance.
   *
   * The initialization of command components, such as, for
   * instance, arguments or options are initialized in the
   * protected and abstract {initialize} method, that must be
   * implemented by subclasses which inherit from this base
   * command class.
   *
   * @param name A string containing the name of the command.
   */
  constructor(name: string) {
    super(name);

    this.initialize();
  }

  /**
   * Initialize command arguments and options.
   *
   * This method is invoked when instantiating a new command or subcommand
   * so that for the latter to set up its options, arguments and so on.
   */
  protected abstract initialize(): void;

  /**
   * Handle auto-completion for this command.
   *
   * This method handle auto-completion for this command when
   * user enter tab key twice at command-line.
   */
  protected abstract autocomplete(): void;
}
