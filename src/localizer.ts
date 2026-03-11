import { Handler } from "@scalable.software/component";

import { Event, Gesture, type Localizations } from "./localizer.meta.js";

/**
 * Localizer addon for components
 * @category Utilities
 */
export class Localizer<T extends object> extends EventTarget {
  /**
   * Active normalized language code used to resolve localization bundles
   * @category State
   * @hidden
   */
  private _language: string;

  /**
   * Tracks whether global event listeners have been registered
   * @category State
   * @default false
   * @hidden
   */
  private _initialized = false;

  /**
   * Handler invoked when the active language changes
   * @category Events
   * @hidden
   */
  private _onlanguagechange: Handler = null;

  /**
   * Available localization bundles keyed by normalized language code
   * @category Data
   * @hidden
   */
  protected localizations: Localizations<T> = {};

  /**
   * Create a localizer with the available language bundles and initial language
   * @category Configuration
   */
  constructor(
    localizations: Localizations<T>,
    language: string = navigator.language,
  ) {
    super();

    this.localizations = localizations;

    this._language = this._normalize(language);
  }

  /**
   * Get the resolved the lexicon for a specific language bundle
   *
   * Resolution order:
   * 1. localizer language
   * 2. English
   * 3. first available bundle
   *
   * @category Data
   */
  public get lexicon(): T {
    const language = this.localizations[this.language];
    if (language) return language;

    const english = this.localizations.en;
    if (english) return english;

    const first = Object.values(this.localizations).find(Boolean);
    if (first) return first;

    throw new Error("Localizer: no localization bundles are available.");
  }

  /**
   * Get the active normalized language code
   * @category State
   */
  public get language(): string {
    return this._language;
  }

  /**
   * Set the active language and emit `onlanguagechange` when it changes
   * @category State
   */
  public set language(language: string) {
    if (!language || this._language === language) return;

    this._language = language;

    this.dispatchEvent(
      new CustomEvent(Event.ON_LANGUAGE_CHANGE, {
        detail: { language },
      }),
    );
  }

  /**
   * Triggered when the active language changes
   * @event
   * @category Events
   */
  public set onlanguagechange(handler: Handler) {
    this._onlanguagechange &&
      this.removeEventListener(
        Event.ON_LANGUAGE_CHANGE,
        this._onlanguagechange,
      );

    this._onlanguagechange = handler;

    this._onlanguagechange &&
      this.addEventListener(Event.ON_LANGUAGE_CHANGE, this._onlanguagechange);
  }

  /**
   * Register global listeners required to keep the localizer in sync
   * @category Operations
   */
  public initialize = () => {
    if (this._initialized) return;
    this._addEventListeners();
    this._initialized = true;
  };

  /**
   * Remove global listeners previously registered by `initialize()`
   * @category Operations
   */
  public dispose = () => {
    if (!this._initialized) return;
    this._removeEventListeners();
    this._initialized = false;
  };

  /**
   * Convenience operation for updating the active language
   * @category Operations
   */
  public setLanguage = (language: string) => (this.language = language);

  /**
   * Register listeners for application-level configuration changes
   * @category Configuration
   * @hidden
   */
  protected _addEventListeners = () =>
    window.addEventListener(
      Gesture.ON_APP_CONFIG_CHANGE,
      this._handleAppConfigChange,
    );

  /**
   * Remove listeners for application-level configuration changes
   * @category Configuration
   * @hidden
   */
  protected _removeEventListeners = () =>
    window.removeEventListener(
      Gesture.ON_APP_CONFIG_CHANGE,
      this._handleAppConfigChange,
    );

  /**
   * Apply language updates received from app configuration change events
   * @category Gesture
   * @hidden
   */
  private _handleAppConfigChange = (
    event: CustomEvent<{ language?: string }>,
  ): void => {
    const { detail } = event;

    if (!detail?.language) return;

    this.language = detail.language;
  };

  /**
   * Normalize locale strings to the base lowercase language code
   * @category Utility
   * @hidden
   */
  private _normalize = (locale: string) => locale.split("-")[0].toLowerCase();
}
