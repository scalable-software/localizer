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
