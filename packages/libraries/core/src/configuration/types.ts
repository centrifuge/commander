// Relay chain or para-chain executable source.
//
// A chain can be launched from a binary executable file (such as, for
// instance, 'polkadot --chain=... --wasm-execution=...'), inside a
// Docker container or compiled from source, given a Git repository
// URL with the branch on which source code can be found.
// This ChainSource type is a so called "discriminated union" with
// exhaustiveness checking (yet another Typescript crap).
export type ChainSource = BinaryFile | DockerImage | GitRepository;
export type BinaryFile = { variant: 'binaryFile'; path: string };
export type DockerImage = { variant: 'dockerImage'; image: string; container: string };
export type GitRepository = { variant: 'gitRepository'; url: string };

// ---- START AJV TEST ----
export interface Configuration {
  buildsDir?: string;
  relaychain: SimpleRelaychainConfig;
}

export interface SimpleRelaychainConfig {
  source: ChainSource;
  chain: string;
  spec?: string;
  nodes: SimpleChainNode[];
  //	genesis?: JSON;
}

export interface SimpleChainNode {
  name: string;
  wsPort: number;
  port: number;
}

export interface SimpleChainSpec {
  name: string;
  id: string;
  chainType: string;
}

// ---- END AJV TEST ---
