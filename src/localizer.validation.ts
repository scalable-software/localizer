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
    return value as string;
  };
}
