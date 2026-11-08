/**
 * @module Localizer
 */

/**
 * Read-only view of the application's persisted settings in localStorage
 * The Localizer reads from it and never writes to it
 * @hidden
 */
export class Storage {
  /**
   * localStorage key holding the persisted language; absent means not consulted
   */
  private readonly _key: string | undefined;

  constructor(key?: string) {
    this._key = key;
  }

  /**
   * The persisted language, or null when no key is configured, the value is
   * absent or empty, or `localStorage` access throws (cookies / site data
   * blocked, sandboxed frame)
   */
  public get language(): string | null {
    if (!this._key) return null;
    try {
      return localStorage.getItem(this._key) || null;
    } catch {
      return null;
    }
  }
}
