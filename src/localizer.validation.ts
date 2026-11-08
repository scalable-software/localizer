/**
 * @module Localizer
 */

import { Gesture } from "./localizer.meta.js";
import type {
  Configuration,
  Language,
  Localizations,
  Options,
} from "./localizer.meta.js";

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
    
    return value as Language;
  };

  /**
   * Validates that the value is a record of localization bundles.
   * Throws if the value is not a non-null, non-array object.
   * @category Validation
   */
  public static localizations = <T extends object>(value: Localizations<T>) => {
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

    const fields: (keyof Options)[] = ["language", "storage"];
    for (const field of fields) {
      const present = value[field] !== undefined;
      if (present && typeof value[field] !== "string") {
        throw new Error(`Invalid options value: ${field} is invalid`);
      }
    }

    return value as Options;
  };

  /**
   * Decides whether a message received on `Channel.CONFIGURATION` is a
   * configuration message with a usable language.
   * Never throws: the channel is shared, so any other message is not an error.
   * The rules for the language value itself stay in the `language` setter.
   * @category Validation
   */
  public static configuration = (
    value: unknown,
  ): value is Configuration & { language: Language } => {
    if (typeof value !== "object" || value === null || Array.isArray(value))
      return false;

    const { type } = value as Record<string, unknown>;
    return type === Gesture.ON_APP_CONFIG_CHANGE;
  };
}
