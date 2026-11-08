import { Channel, Event, Gesture } from "./localizer.meta.js";
import type { Localizations, Options } from "./localizer.meta.js";

// Validation
import { Validate } from "./localizer.validation.js";

// Storage
import { Storage } from "./localizer.storage.js";

/**
 * Localizer addon for components
 * @category Utilities
 */
export class Localizer<T extends object> extends EventTarget {
  /**
   * Active language value used to resolve localization bundles
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
  private _onlanguagechange: EventListener | null = null;

  /**
   * Available localization bundles keyed by language code
   * @category Data
   * @hidden
   */
  private _localizations: Localizations<T> = {};

  /**
   * Read-only access to the persisted language at `options.storage`
   * @category Data
   * @hidden
   */
  private _storage: Storage;

  /**
   * BroadcastChannel for inter-component communication
   * @category Channel
   * @hidden
   */
  private _channel: BroadcastChannel | null = null;

  /**
   * Create a localizer with the available language bundles and initial language
   * The constructor normalizes the initial language to the base lowercase code
   * @category Lifecycle
   */
  constructor(localizations: Localizations<T>, options: Options = {}) {
    super();

    this._localizations = Validate.localizations(localizations);

    const { language, storage } = Validate.options(options);

    this._storage = new Storage(storage);
    this._language = this._initialLanguage(language);
  }

  /**
   * Get the resolved the lexicon for a specific language bundle
   *
   * Resolution order:
   * 1. current language value
   * 2. English
   * 3. first available bundle
   *
   * @category State
   */
  public get lexicon(): T {
    const language = this._localizations[this.language];
    if (language) return language;

    const english = this._localizations.en;
    if (english) return english;

    const first = Object.values(this._localizations).find(Boolean);
    if (first) return first;

    throw new Error("Localizer: no localization bundles are available.");
  }

  /**
   * Get the localization bundles the localizer was created with
   * @category Data
   */
  public get localizations(): Localizations<T> {
    return this._localizations;
  }

  /**
   * Get the active language value used for lexicon lookup
   * @category State
   */
  public get language(): string {
    return this._language;
  }

  /**
   * Set the active language and emit `onlanguagechange` when it changes
   * The assigned value is stored as provided and is not normalized here
   * @category State
   */
  public set language(language: string) {
    // Normalize — falsy values are ignored
    if (!language) return;

    // Validate
    language = Validate.language(language);

    // Guard
    if (this._language === language) return;

    // Mutate
    this._language = language;

    // Dispatch
    const detail = { language };
    this._dispatch(Event.ON_LANGUAGE_CHANGE, detail);
  }

  /**
   * Triggered when the active language changes to a new truthy value
   * @event
   * @category Events
   */
  public set onlanguagechange(handler: EventListener | null) {
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
   * This delegates to the `language` setter and does not normalize the value
   * @category Operations
   */
  public setLanguage = (language: string) => (this.language = language);

  /**
   * Register listeners for application-level configuration changes
   * @category Lifecycle
   * @hidden
   */
  protected _addEventListeners = () => {
    this._channel = new BroadcastChannel(Channel.CONFIGURATION);
    this._channel.addEventListener(Gesture.MESSAGE, this._handleMessage);
  };

  /**
   * Remove listeners for application-level configuration changes
   * @category Lifecycle
   * @hidden
   */
  protected _removeEventListeners = () => {
    this._channel?.removeEventListener(Gesture.MESSAGE, this._handleMessage);
    this._channel?.close();
    this._channel = null;
  };

  /**
   * Dispatches a CustomEvent from the component with its detail
   * @param event - The name of the event
   * @param detail - The event's detail; without it, `event.detail` is `null`
   * @returns `false` when the event was cancelled; otherwise `true`
   * @hidden
   */
  private _dispatch = (event: string, detail?: unknown): boolean =>
    this.dispatchEvent(
      new CustomEvent(event, detail === undefined ? undefined : { detail }),
    );

  /**
   * Set the language from configuration messages received on `Channel.CONFIGURATION`
   * The channel is shared and makes no promise about what it carries: any
   * message that is not a configuration message with a usable language is
   * ignored silently, never thrown on
   * @category Gesture
   * @hidden
   */
  private _handleMessage = (message: MessageEvent<unknown>): void => {
    if (!Validate.configuration(message.data)) return;
    this.language = message.data.language;
  };

  /**
   * The language the localizer starts with: resolved, then normalized
   * @category Utility
   * @hidden
   */
  private _initialLanguage = (language?: string): string =>
    this._normalizeLanguage(this._resolveLanguage(language));

  /**
   * Resolve the initial language
   * Resolution order: the explicit option, else the persisted language at
   * the configured storage key, else the browser language
   * @category Utility
   * @hidden
   */
  private _resolveLanguage = (language?: string): string =>
    language ?? this._storage.language ?? navigator.language;

  /**
   * Normalize a language to its base lowercase code (`en-US` becomes `en`)
   * @category Utility
   * @hidden
   */
  private _normalizeLanguage = (language: string): string =>
    language.split("-")[0].toLowerCase();
}
