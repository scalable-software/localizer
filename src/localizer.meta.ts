/**
 * Named data collections exposed by the Localizer public API
 * @category Metadata: Data
 * @enum
 */
export const Data = {
  LOCALIZATIONS: "localizations",
  OPTIONS: "options",
} as const;

/**
 * Named data collections exposed by the Localizer public API
 * @category Metadata: Data
 */
export type Data = (typeof Data)[keyof typeof Data];

/**
 * State names exposed by the Localizer public API
 * @category Metadata: State
 * @enum
 */
export const State = {
  LANGUAGE: "language",
  LEXICON: "lexicon",
} as const;

/**
 * State names exposed by the Localizer public API
 * @category Metadata: State
 */
export type State = (typeof State)[keyof typeof State];

/**
 * Value domain of the `language` state: an open language code such as `en` or `de`
 * @category Metadata: State
 */
export type Language = string;

/**
 * Operation names exposed by the Localizer public API
 * @category Metadata: Operations
 * @enum
 */
export const Operation = {
  INITIALIZE: "initialize",
  DISPOSE: "dispose",
  SET_LANGUAGE: "setLanguage",
} as const;

/**
 * Operation names exposed by the Localizer public API
 * @category Metadata: Operations
 */
export type Operation = (typeof Operation)[keyof typeof Operation];

/**
 * Event names emitted by the Localizer public API
 * @category Metadata: Events
 * @enum
 */
export const Event = {
  ON_LANGUAGE_CHANGE: "onlanguagechange",
} as const;

/**
 * Event names emitted by the Localizer public API
 * @category Metadata: Events
 */
export type Event = (typeof Event)[keyof typeof Event];

/**
 * Gesture names observed by the Localizer public API
 * @category Metadata: Gesture
 * @enum
 */
export const Gesture = {
  ON_APP_CONFIG_CHANGE: "onappconfigchange",
} as const;

/**
 * Gesture names observed by the Localizer public API
 * @category Metadata: Gesture
 */
export type Gesture = (typeof Gesture)[keyof typeof Gesture];

/**
 * Localization bundles keyed by language code
 *
 * Each key represents a language identifier such as `en` or `de`.
 * Each value is either a lexicon object or `undefined`.
 *
 * @category Metadata: Data
 */
export type Localizations<T extends object> = Record<string, T | undefined>;

/**
 * Constructor options
 *
 * `language` is an explicit initial language and wins over storage.
 * `storage` names a localStorage key holding the persisted language; it is
 * read once at construction and never written. When absent, storage is not
 * consulted.
 *
 * @category Metadata: Data
 */
export type Options = {
  language?: string;
  storage?: string;
};
