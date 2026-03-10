/**
 * HTML Attributes available to set
 * @category Metadata: State
 * @enum
 */
export const State = {
  LANGUAGE: "language",
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
export const Event = {} as const;
/**
 * @category Metadata: Events
 */
export type Event = (typeof Event)[keyof typeof Event];
