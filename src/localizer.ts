/**
 * @module Localizer
 */

import { type Handler } from "@scalable.software/component";

export type LocalizationDictionary<T extends object> = Record<
  string,
  T | undefined
>;

export type AppConfigChangeDetail = {
  language?: string;
};

export enum LocalizerEvent {
  ON_LANGUAGE_CHANGE = "languagechange",
}

export enum LocalizerGesture {
  APP_CONFIG_CHANGE = "appconfigchange",
}

/**
 * Localizer addon for components
 * @category Utilities
 */
export class Localizer<T extends object> extends EventTarget {
  /**
   * Localized bundles keyed by language
   * @category Data
   * @hidden
   */
  protected localizations: LocalizationDictionary<T>;

  /**
   * Internal language state
   * @category State
   * @hidden
   */
  private _language: string;

  /**
   * Track whether the Localizer is initialized
   * @category State
   * @hidden
   */
  private _initialized = false;

  /**
   * onlanguagechange triggered when language changes
   * @category Events
   * @hidden
   */
  private _onlanguagechange: Handler = null;

  /**
   * Handle app configuration changes
   * @category Gesture
   * @hidden
   */
  private _onappconfigchange = (event: Event) =>
    this._handleAppConfigChange(event);

  /**
   * Create a new Localizer
   * @category Configuration
   */
  constructor(
    localizations: LocalizationDictionary<T>,
    language = navigator.language,
  ) {
    super();

    this.localizations = localizations;
    this._language = this._normalizeLanguage(language);
  }

  /**
   * Get or Set the language of the Localizer
   * @category State
   */
  public get language(): string {
    return this._language;
  }
  public set language(language: string) {
    if (!language || this._language === language) return;

    this._language = language;

    this.dispatchEvent(
      new CustomEvent(LocalizerEvent.ON_LANGUAGE_CHANGE, {
        detail: { language },
      }),
    );
  }

  /**
   * Get the resolved localization bundle
   *
   * Resolution order:
   * 1. normalized language key
   * 2. English
   * 3. first available bundle
   *
   * @category Data
   */
  public get localization(): T {
    const direct = this.localizations[this.language];
    if (direct) return direct;

    const english = this.localizations.en;
    if (english) return english;

    const first = Object.values(this.localizations).find(Boolean);
    if (first) return first;

    throw new Error("Localizer: no localization bundles are available.");
  }

  /**
   * Triggered via `.setLanguage()`
   * @event
   * @category Events
   */
  public set onlanguagechange(handler: Handler) {
    this._onlanguagechange &&
      this.removeEventListener(
        LocalizerEvent.ON_LANGUAGE_CHANGE,
        this._onlanguagechange,
      );

    this._onlanguagechange = handler;

    this._onlanguagechange &&
      this.addEventListener(
        LocalizerEvent.ON_LANGUAGE_CHANGE,
        this._onlanguagechange,
      );
  }

  /**
   * Initialize the Localizer
   * @category Operations
   */
  public initialize = () => {
    if (this._initialized) return;

    window.addEventListener(
      LocalizerGesture.APP_CONFIG_CHANGE,
      this._onappconfigchange,
    );

    this._initialized = true;
  };

  /**
   * Dispose the Localizer
   * @category Operations
   */
  public dispose = () => {
    if (!this._initialized) return;

    window.removeEventListener(
      LocalizerGesture.APP_CONFIG_CHANGE,
      this._onappconfigchange,
    );

    this._initialized = false;
  };

  /**
   * Set the language of the Localizer
   * @category Operations
   */
  public setLanguage = (language: string) =>
    (this.language = this._normalizeLanguage(language));

  /**
   * Handle application configuration changes
   * @category Gesture
   * @hidden
   */
  protected _handleAppConfigChange = (event: Event): void => {
    const { detail } = event as CustomEvent<AppConfigChangeDetail>;

    detail?.language &&
      (this.language = this._normalizeLanguage(detail.language));
  };

  /**
   * Normalize a language or locale to a base language key
   * @category Utility
   * @hidden
   */
  protected _normalizeLanguage = (language?: string): string =>
    (language || navigator.language).split("-")[0].toLowerCase();
}
