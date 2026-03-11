import { Handler } from "@scalable.software/component";

import { Event, type Localizations } from "./localizer.meta.js";

/**
 * Localizer addon for components
 * @category Utilities
 */
export class Localizer<T extends object> extends EventTarget {
  private _language: string;

  private _onlanguagechange: Handler = null;

  protected localizations: Localizations<T> = {};

  constructor(localizations: Localizations<T>) {
    super();

    this.localizations = localizations;

    this._language = this._normalize(navigator.language);
  }

  public get lexicon(): T {
    const language = this.localizations[this.language];
    if (language) return language;
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

  public setLanguage = (language: string) => (this.language = language);

  private _normalize = (locale: string) => locale.split("-")[0].toLowerCase();
}
