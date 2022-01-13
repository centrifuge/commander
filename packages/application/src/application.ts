/**
 * Application module.
 *
 * @module
 */

import { BaseCommand } from '@centrifuge-cli/core/command';
import { ChainCommand } from '@centrifuge-cli/chain-command/command';
import { SetupCommand } from '@centrifuge-cli/setup-command/command';
import colors from '@centrifuge-cli/core/colors';
import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join, normalize } from 'path';

/*
 * Load application's metadata.
 *
 * Note that importing JSON modules is still an experimental Node feature (see https://nodejs.org/api/esm.html#json-modules).
 * It requires '--experimental-json-modules' flag for running a script that loads a JSON file as a module using the new ECMA
 * Script Module (or ESM) standard (see 'bin/run.js' script, for instance).
 * The 'assert' directive is mandatory (as explained in https://nodejs.org/api/esm.html#import-assertions).
 */
import packageInfo from '@centrifuge-cli/application/package.json' assert { type: 'json' };

/**
 * Application's main command.
 *
 * Entry point of the command line interface (CLI). This class implements the root
 * command, to which other child commands are appended.
 *
 * ## Example
 * ```typescript
 * import { Application } from '@centrifuge-cli/application';
 *
 *  await new Application().run();
 * ```
 */
export class Application extends BaseCommand {
  /* Command description */
  private static readonly Name = 'centrifuge';
  private static readonly Description = 'The Centrifuge ecosystem at your finger tips';
  private static readonly Help = `
Use ${colors.command('centrifuge [command] --help')} for more information on a command
 or ${colors.command('centrifuge [command] [subcommand] --help')} for help on a subcommand`;

  /* Path constants definition */
  private static readonly ConfigDirectoryName = '.centrifuge';
  private static readonly ConfigFileName = 'config';
  private static readonly LogsDirectoryName = '_logs';

  /**
   * Builds a new application's root command instance.
   *
   * @param {string}} name A string containing the name of the application (default value is 'centrifuge').
   */
  constructor(name?: string) {
    super(name === undefined ? Application.Name : name);

    this.installSignalHandlers();
  }

  /**
   * Handle command auto-completion.
   */
  public autocomplete(): void {
    console.log('Application does not implement auto-completion for now');
  }

  /**
   * Create a new application instance.
   *
   * This function creates a new instance of this command and append child
   * commands to it, also called actions.
   */
  protected initialize(): void {
    this.name(Application.Name)
      .version(packageInfo.version)
      .description(Application.Description)
      .addHelpText('after', Application.Help)
      .addCommand(new ChainCommand())
      .addCommand(new SetupCommand());
  }

  /**
   * Start application.
   *
   * The command-line arguments are parsed and requested command action is executed.
   *
   * @example:
   * ```typescript
   * import { Application } from '@centrifuge-cli/application';
   *
   * await new Application().run();
   * ```
   */
  public async run(): Promise<void> {
    this.checkCommandLineArguments();

    /* parse command-line arguments and run the requested command */
    await this.parseAsync();
  }

  /*
   * Perform seminal application setup (if not already done).
   *
   * When launching the application for the first time, this method is invoked in order
   * to set application's parameters and preferences up.
   */
  private installSignalHandlers() {
    /* trap termination signal */
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received... closing application gracefully');
    });

    /* trap Control-C interrupt signal */
    process.on('SIGINT', () => {
      console.log('SIGINT signal received... closing application gracefully');
    });
  }

  /*
   * Check sanity of command-line arguments.
   *
   * When executing this application from a run script, the list of
   * command-line arguments (i.e. 'process.argv' on Node) contains 'node'
   * and run script name as the first two parameters. This method erases
   * them from the list of arguments so that to only pass application
   * command arguments.
   * Moreover, the application uses (experimental) JSON file importation
   * support as EcmaScript Modules (ESMs), so that to import the application's
   * 'package.json' file, for instance, with the following code:
   *
   * ```typescript
   * import packageConfig from './package.json' assert { type: 'json' };
   * ```
   *
   * For doing so, Node engine must be launched with '--experimental-json-modules'
   * flag set to true (see https://nodejs.org/api/esm.html#json-modules and
   * https://nodejs.org/api/esm.html#import-assertions for more information). Take a
   * glance at 'bin/run.js' script.
   */
  private checkCommandLineArguments() {
    /* remove node and run script arguments */
    if (process.argv.length >= 2) {
      let sliceStartIndex = 0;
      if (process.argv[0].includes('node')) sliceStartIndex++;
      if (process.argv[1].includes('run')) sliceStartIndex++;

      /* remove the first two arguments */
      process.argv.slice(sliceStartIndex);
    }

    /* display application usage when no argument is passed at command-line */
    if (process.argv.length === 0) {
      this.help();
    }
  }

  /**
   * Return the directory where CLI configuration files are stored.
   *
   * @return {string} a string containing the path to the configuration directory.
   */
  public static getConfigDirectoryPath(): string {
    return normalize(join(homedir(), Application.ConfigDirectoryName));
  }

  /**
   * Return application's configuration file path.
   *
   * This file is usually stored in '~/.centrifuge/config' on Unix flavors.
   */
  public static getConfigFilePath(): string {
    return normalize(join(Application.getConfigDirectoryPath(), Application.ConfigFileName));
  }

  /**
   * Scaffold application's configuration directory.
   */
  public static scaffoldConfigFolder() {
    const folderName = Application.getConfigDirectoryPath();

    mkdirSync(folderName, { recursive: true });
    mkdirSync(normalize(join(folderName, Application.LogsDirectoryName)), { recursive: true });
  }

  /**
   * Check if application is executed for the first time.
   *
   * When executed for the first time, the application invites users to go through
   * a seminal welcome wizard which guides users for setting up ther preferences and
   * application's basic parameters (e.g. cloud provider credentials, preferred language, 
   * and so on).
   *
   * @returns true if the application has a configuration folder and true otherwise.
   */
  public isFirstTime(): boolean {
    return existsSync(Application.getConfigFilePath());
  }
}
