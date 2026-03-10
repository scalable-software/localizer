import { Handler } from "@scalable.software/component";

import { Event } from "./localizer.meta.js";

/**
 * Localizer addon for components
 * @category Utilities
 */
export class Localizer<T extends object> extends EventTarget {
  private _language: string;

  private _onlanguagechange: Handler = null;

  constructor() {
    super();

    this._language = this._normalize(navigator.language);
  }

  public get language(): string {
    return this._language;
  }
  public set language(language: string) {
    if (!language) return;

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
