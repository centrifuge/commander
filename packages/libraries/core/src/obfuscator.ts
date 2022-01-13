export class Obfuscator {
  /**
   * Obfuscate the given string content.
   *
   * @param value An input string that must be obfuscated.
   */
  public static obfuscate(value: string) {
    const { length } = value;
    const half = Math.round(length / 2);
    return value.substr(0, half) + '*'.repeat(length - half);
  }

  public static isObfuscated(value = '') {
    const { length } = value;

    if (length === 0) return false;

    const half = Math.round(length / 2);
    return value.substr(half) === '*'.repeat(length - half);
  }
}
