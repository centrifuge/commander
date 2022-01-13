import { register } from 'ts-node';

/**
 * The register file loads the tsconfig to instrument the ts-node. It improves performance 
 * with a negligible compromise. The transpileOnly property tells TypeScript to avoid 
 * checking the test code during the “compiling” phase.
 */
register({
  files: true,
  transpileOnly: true,
  project: '../tsconfig.json',
});
