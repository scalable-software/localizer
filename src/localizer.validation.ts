/**
 * @module Localizer
 */

/**
 * Runtime enforcement of the value domains declared in `localizer.meta.ts`
 * @category Validation
 */
export class Validate {
  /**
   * Validates that the value is a `string` language code.
   * Throws if the value is not a string.
   * @category Validation
   */
  public static language = (value: string) => {
    const valid = typeof value === "string";
    if (!valid) {
      throw new Error(`Invalid language value: ${value}`);
    }
    return value as string;
  };
}
