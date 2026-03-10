/**
 * Localizer addon for components
 * @category Utilities
 */
export class Localizer<T extends object> extends EventTarget {
  private _language: string;

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
  }

  private _normalize = (locale: string) => locale.split("-")[0].toLowerCase();
}
