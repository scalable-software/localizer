export const Data = {
  LOCALIZATIONS: "localizations",
} as const;

export type Data = (typeof Data)[keyof typeof Data];

/**
 * HTML Attributes available to set
 * @category Metadata: State
 * @enum
 */
export const State = {
  LANGUAGE: "language",
  LEXICON: "lexicon",
} as const;

/**
 * HTML Attributes available to set
 * @category Metadata: State
 */
export type State = (typeof State)[keyof typeof State];

/**
 * @category Metadata: Operations
 * @enum
 */
export const Operation = {
  INITIALIZE: "initialize",
  DISPOSE: "dispose",
  SET_LANGUAGE: "setLanguage",
} as const;

/**
 * @category Metadata: Operations
 */
export type Operation = (typeof Operation)[keyof typeof Operation];

/**
 * @category Metadata: Events
 * @enum
 */
export const Event = {
  ON_LANGUAGE_CHANGE: "onlanguagechange",
} as const;
/**
 * @category Metadata: Events
 */
export type Event = (typeof Event)[keyof typeof Event];

/**
 * @category Metadata: Gesture
 * @enum
 */
export const Gesture = {
  ON_APP_CONFIG_CHANGE: "onappconfigchange",
} as const;
/**
 * @category Metadata: Gesture
 */
export type Gesture = (typeof Gesture)[keyof typeof Gesture];

export type Localizations<T extends object> = Record<string, T | undefined>;
