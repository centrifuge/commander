import { xxhashAsHex, blake2AsHex } from '@polkadot/util-crypto';

// export enum HasherFunction {
//   None,
//   Twox64,
//   Twox64Concat,
//   Twox128,
//   Twox256,
//   Blake2_128,
//   Blake2_128Concat,
//   Blake2_256
// }

export interface Hasher {
  hash(input: string | Uint8Array): string;
}

export class Twox128Hasher implements Hasher {
  public hash(input: string | Uint8Array): string {
    /* Note:
     * We use XXHash to output a 128 bit hash. However, XXHash only supports 32 bit and 64 bit outputs. 
     * To correctly generate the 128 bit hash, we need to hash the same phrase twice, with seed 0 and seed 1, 
     * and concatenate them.
     */
    return xxhashAsHex(input, 128).slice(2);
  }
}

export class Twox256Hasher implements Hasher {
  public hash(input: string | Uint8Array): string {
    return xxhashAsHex(input, 256).slice(2);
  }
}

export class Blake2_128Hasher implements Hasher {
  public hash(input: string | Uint8Array): string {
    return blake2AsHex(input, 128).slice(2);
  }
}

export class Blake2_256Hasher implements Hasher {
  public hash(input: string | Uint8Array): string {
    return blake2AsHex(input, 256).slice(2);
  }
}

    // static async hash(input: string | Uint8Array, function: Function): Promise<string> {
    //     if (hasher === Hasher.None){
    //         return await hexEncode(input);
    //     } else if(hasher === Hasher.Twox64) {
    //         return xxhashAsHex(input, 64).slice(2);
    //     } else if (hasher === Hasher.Twox64Concat) {
    //         return xxhashAsHex(input, 64).slice(2) + await hexEncode(input);
    //     } else if (hasher === Hasher.Twox128) {
    //         return xxhashAsHex(input, 128).slice(2);
    //     } else if (hasher === Hasher.Twox256) {
    //         return xxhashAsHex(input, 256).slice(2);
    //     } else if (hasher === Hasher.Blake2_128) {
    //         return blake2AsHex(input, 128).slice(2);
    //     } else if (hasher === Hasher.Blake2_128Concat) {
    //         return blake2AsHex(input, 128).slice(2) + await hexEncode(input);
    //     } else if (hasher === Hasher.Blake2_256) {
    //         return blake2AsHex(input, 256).slice(2);
    //     } else {
    //         return Promise.reject("Unreachable code");
    //     }
    // }
