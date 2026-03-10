/**
 * HTML Attributes available to set
 * @category Metadata: State
 * @enum
 */
export const State = {} as const;

/**
 * HTML Attributes available to set
 * @category Metadata: State
 */
export type State = (typeof State)[keyof typeof State];
