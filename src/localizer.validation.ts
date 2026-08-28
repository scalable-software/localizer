/**
 * @module Localizer
 */

import { type Localizations, type Options } from "./localizer.meta.js";

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

  /**
   * Validates that the value is a record of localization bundles.
   * Throws if the value is not a non-null, non-array object.
   * @category Validation
   */
  public static localizations = <T extends object>(
    value: Localizations<T>,
  ) => {
    const valid =
      typeof value === "object" && value !== null && !Array.isArray(value);
    if (!valid) {
      throw new Error(`Invalid localizations value: ${value}`);
    }
    return value as Localizations<T>;
  };

  /**
   * Validates that the value is a constructor options object.
   * Throws if the value is not a non-null, non-array object, or if a present
   * `language` or `storage` field is not a string.
   * @category Validation
   */
  public static options = (value: Options) => {
    const valid =
      typeof value === "object" && value !== null && !Array.isArray(value);
    if (!valid) {
      throw new Error(`Invalid options value: ${value}`);
    }
    return value as Options;
  };
}
