import { Handler } from "@scalable.software/component";

import { Event, Gesture, type Localizations } from "./localizer.meta.js";

/**
 * Localizer addon for components
 * @category Utilities
 */
export class Localizer<T extends object> extends EventTarget {
  private _language: string;

  private _initialized = false;

  private _onlanguagechange: Handler = null;

  protected localizations: Localizations<T> = {};

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

  public get language(): string {
    return this._language;
  }
  public set language(language: string) {
    if (!language || this._language === language) return;

    this._language = language;

    this.dispatchEvent(
      new CustomEvent(Event.ON_LANGUAGE_CHANGE, {
        detail: { language },
      }),
    );
  }

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

  public initialize = () => {
    if (this._initialized) return;
    this._addEventListeners();
    this._initialized = true;
  };

  public dispose = () => {
    if (!this._initialized) return;
    this._removeEventListeners();
    this._initialized = false;
  };

  public setLanguage = (language: string) => (this.language = language);

  protected _addEventListeners = () =>
    window.addEventListener(
      Gesture.ON_APP_CONFIG_CHANGE,
      this._handleAppConfigChange,
    );

  protected _removeEventListeners = () =>
    window.removeEventListener(
      Gesture.ON_APP_CONFIG_CHANGE,
      this._handleAppConfigChange,
    );

  private _handleAppConfigChange = (
    event: CustomEvent<{ language?: string }>,
  ): void => {
    const { detail } = event;

    if (!detail?.language) return;

    this.language = detail.language;
  };

  private _normalize = (locale: string) => locale.split("-")[0].toLowerCase();
}
