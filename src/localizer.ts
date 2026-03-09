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
    this._language = language;
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
   * 1. exact language
   * 2. base language
   * 3. English
   * 4. first available bundle
   *
   * @category Data
   */
  public get localization(): T {
    const exact = this.localizations[this.language];
    if (exact) return exact;

    const base = this.localizations[this._baseLanguage(this.language)];
    if (base) return base;

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
  public setLanguage = (language: string) => (this.language = language);

  /**
   * Handle application configuration changes
   * @category Gesture
   * @hidden
   */
  protected _handleAppConfigChange = (event: Event): void => {
    const { detail } = event as CustomEvent<AppConfigChangeDetail>;

    detail?.language && (this.language = detail.language);
  };

  /**
   * Extract base language from locale
   * @category Utility
   * @hidden
   */
  protected _baseLanguage = (language: string): string =>
    language.split("-")[0];
}
