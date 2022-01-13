export type Platform = 'darwin' | 'linux' | 'win32' | 'aix' | 'freebsd' | 'openbsd' | 'sunos' | 'wsl';
// eslint-disable-next-line prettier/prettier
export type Architecture = 'arm' | 'arm64' | 'mips' | 'mipsel' | 'ppc' | 'ppc64' | 's390' | 's390x' | 'x32' | 'x64' | 'x86';

/**
 * Command execution context.
 */
export interface Context {
  architecture?: Architecture;
}
