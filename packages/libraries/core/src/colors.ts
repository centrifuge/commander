import styles from 'ansi-styles';
import chalk from 'chalk';
import * as supports from 'supports-color';
import { deprecate } from 'util';

const stripColor = (s: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return require('strip-ansi')(s);
};

const dim = process.env.ConEmuANSI === 'ON' ? chalk.gray : chalk.dim;

export const CustomColors: {
  supports: typeof supports;
  gray(s: string): string;
  grey(s: string): string;
  dim(s: string): string;
  attachment(s: string): string;
  addon(s: string): string;
  configVar(s: string): string;
  release(s: string): string;
  command(s: string): string;
  subcommand(s: string): string;
  pipeline(s: string): string;
  app(s: string): string;
  centrifuge(s: string): string;
  stripColor(s: string): string;
} = {
  supports,
  // map gray -> dim because it's not solarized compatible
  gray: dim,
  grey: dim,
  dim,
  attachment: chalk.cyan,
  addon: chalk.yellow,
  configVar: chalk.green,
  release: chalk.blue.bold,
  command: chalk.cyan.bold,
  subcommand: chalk.greenBright.bold,
  pipeline: chalk.green.bold,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  app: (s: string) => (chalk.level > 0 ? colors.centrifuge(`⬢ ${s}`) : s),
  centrifuge: (s: string) => {
    if (chalk.level === 0) return s;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (!colors.supports) return s;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const has256 = colors.level >= 2 || (process.env.TERM || '').indexOf('256') !== -1;
    return has256 ? '\u001b[38;5;104m' + s + styles.reset.open : chalk.magenta(s);
  },
  stripColor: deprecate(
    stripColor,
    '.stripColor is deprecated. Please import the "strip-ansi" module directly instead.',
  ),
};

export const colors: typeof CustomColors & typeof chalk = new Proxy(chalk, {
  get: (chalk, name) => {
    if ((CustomColors as any)[name]) return (CustomColors as any)[name];
    return (chalk as any)[name];
  },
  set: (chalk, name, value) => {
    switch (name) {
      case 'enabled':
        if (!value) chalk.level = 0;
        break;
      default:
        throw new Error(`cannot set property ${name.toString()}`);
    }
    return true;
  },
}) as typeof CustomColors & typeof chalk;

export default colors;
