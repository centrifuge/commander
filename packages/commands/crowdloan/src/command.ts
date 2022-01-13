import { Command } from 'commander';
//import { cli } from 'cli-ux';

/**
 * Crowdloan management command.
 *
 * This command is used to manage Polkadot/Kusama crowdloan auctions that are used
 * when acquiring or renewing a parachain slot on relay chains.
 */
export class CrowdloanCommand extends Command {
  /**
   * Create a new root command.
   *
   * @param {string} [name]
   * @return {Command} new command
   */
  createCommand(name?: string): Command {
    const command = new CrowdloanCommand(name);

    command.option('-c, --config <path>', "set configuration file's path name", './config.json');

    return command;
  }
}

export function buildCommand(): CrowdloanCommand {
  const command = new CrowdloanCommand('crowdloan');

  command
    .description('Manage Polkadot/Kusama crowdloan auctions for parachain slot acquisition or renewal')
    .addHelpText(
      'after',
      `
Examples:
$ centrifuge crowdloan create ..."
$ centrifuge crowdloan delete ...`,
    );

  command
    .command('create')
    .description('Create crowdloan')
    .action(() => {
      console.log('Call crowdloan->create');
    });

  command
    .command('renew')
    .description('Renew an existing parachain slot on Polkadot or Kusama network')
    .action(() => {
      console.log('Call crowdloan->renew');
    });

  return command;
}
