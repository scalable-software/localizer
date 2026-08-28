import {
  Localizer,
  Data,
  State,
  Operation,
  Event,
  Gesture,
} from "@scalable.software/localizer";

import { type Localizations, type Options } from "@scalable.software/localizer";

// Number of calls a window listener spy received for a given event type
const listenerCalls = (spy: jasmine.Spy, type: string) =>
  spy.calls.allArgs().filter(([name]) => name === type).length;

data(Data.LOCALIZATIONS, () => {
  given("Localizations defined", () => {
    let localizations: Localizations<object>;
    beforeEach(() => {
      localizations = {
        en: { greeting: "Hello" },
        de: { greeting: "Hallo" },
      };
    });

    and("localizer instantiated with localizations", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer(localizations);
      });

      then("`localizer.localizations` getter exists", () => {
        expect(hasGetter(localizer, "localizations")).toBe(true);
      });

      and("`localizer.localizations` getter exists", () => {
        then("`localizer.localizations` is `localizations`", () => {
          expect(localizer.localizations).toBe(localizations);
        });
      });
    });
  });

  given("Localizer instantiated with `null` as localizations", () => {
    let error: Error;
    beforeEach(() => {
      try {
        new Localizer(null as unknown as Localizations<object>);
      } catch (err) {
        error = err as Error;
      }
    });

    then("an error is thrown", () => {
      expect(error).toBeDefined();
    });

    then("error message is `Invalid localizations value: null`", () => {
      expect(error.message).toBe("Invalid localizations value: null");
    });
  });
});

data(Data.OPTIONS, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({});
    });

    then("`localizer.options` getter exists", () => {
      expect(localizer.options).toBeDefined();
    });

    and("`localizer.options` getter exists", () => {
      then("`localizer.options` is `{}`", () => {
        expect(localizer.options).toEqual({});
      });
    });
  });

  given("Localizer instantiated with `\"de\"` as options", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({}, "de");
    });

    then("`localizer.options` is `{ language: \"de\" }`", () => {
      expect(localizer.options).toEqual({ language: "de" });
    });
  });

  given("Localizer instantiated with `null` as options", () => {
    let error: Error;
    beforeEach(() => {
      try {
        new Localizer({}, null as unknown as Options);
      } catch (err) {
        error = err as Error;
      }
    });

    then("an error is thrown", () => {
      expect(error).toBeDefined();
    });

    then("error message is `Invalid options value: null`", () => {
      expect(error.message).toBe("Invalid options value: null");
    });
  });
});

state(State.LANGUAGE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({});
    });

    then("localizer.language getter is defined", () => {
      expect(localizer.language).toBeDefined();
    });

    and("localizer.language getter is defined", () => {
      then("localizer.language match language of the browser", () => {
        const language = navigator.language.split("-")[0].toLowerCase();
        expect(localizer.language).toBe(language);
      });
    });

    then("localizer.language setter is defined", () => {
      expect(hasSetter(localizer, "language")).toBe(true);
    });

    and("localizer.language setter is defined", () => {
      when("localizer.language is set to language", () => {
        let language: string;
        beforeEach(() => {
          language = "de";
          localizer.language = language;
        });
        then("localizer.language is set to language", () => {
          expect(localizer.language).toBe(language);
        });
      });

      when("`localizer.language` is set to `42`", () => {
        let error: Error;
        beforeEach(() => {
          try {
            // @ts-expect-error
            localizer.language = 42;
          } catch (err) {
            error = err as Error;
          }
        });

        then("an error is thrown", () => {
          expect(error).toBeDefined();
        });

        then("error message is `Invalid language value: 42`", () => {
          expect(error.message).toBe("Invalid language value: 42");
        });
      });
    });
  });

  given("Localizer instantiated with language", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({}, "de");
    });

    then("localizer.language is set to language", () => {
      expect(localizer.language).toBe("de");
    });
  });

  given("Localizer instantiated with `\"en-US\"` as language", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({}, "en-US");
    });

    then("`localizer.language` is normalized to `\"en\"`", () => {
      expect(localizer.language).toBe("en");
    });
  });

  given("Localizer instantiated with `{ language: \"nl-NL\" }` as options", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({}, { language: "nl-NL" });
    });

    then("`localizer.language` is seeded to `\"nl\"`", () => {
      expect(localizer.language).toBe("nl");
    });
  });

  given("`localStorage[\"app.language\"]` is `\"nl-NL\"`", () => {
    beforeEach(() => {
      spyOn(localStorage, "getItem").and.callFake((key: string) =>
        key === "app.language" ? "nl-NL" : null,
      );
    });

    and("Localizer instantiated with `{ storage: \"app.language\" }` as options", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer({}, { storage: "app.language" });
      });

      then("`localizer.language` is seeded to `\"nl\"`", () => {
        expect(localizer.language).toBe("nl");
      });
    });

    and(
      "Localizer instantiated with `{ language: \"de\", storage: \"app.language\" }` as options",
      () => {
        let localizer: Localizer<object>;
        beforeEach(() => {
          localizer = new Localizer(
            {},
            { language: "de", storage: "app.language" },
          );
        });

        then("`localizer.language` is seeded to `\"de\"`", () => {
          expect(localizer.language).toBe("de");
        });
      },
    );
  });

  given("`localStorage[\"app.language\"]` is absent", () => {
    beforeEach(() => {
      spyOn(localStorage, "getItem").and.returnValue(null);
    });

    and("Localizer instantiated with `{ storage: \"app.language\" }` as options", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer({}, { storage: "app.language" });
      });

      then("`localizer.language` is seeded from the browser language", () => {
        const language = navigator.language.split("-")[0].toLowerCase();
        expect(localizer.language).toBe(language);
      });
    });
  });

  given("`localStorage[\"app.language\"]` is `\"\"`", () => {
    beforeEach(() => {
      spyOn(localStorage, "getItem").and.returnValue("");
    });

    and("Localizer instantiated with `{ storage: \"app.language\" }` as options", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer({}, { storage: "app.language" });
      });

      then("`localizer.language` is seeded from the browser language", () => {
        const language = navigator.language.split("-")[0].toLowerCase();
        expect(localizer.language).toBe(language);
      });
    });
  });

  given("`localStorage.getItem` throws", () => {
    beforeEach(() => {
      spyOn(localStorage, "getItem").and.throwError("SecurityError");
    });

    and("Localizer instantiated with `{ storage: \"app.language\" }` as options", () => {
      let localizer: Localizer<object>;
      let error: Error | undefined;
      beforeEach(() => {
        try {
          localizer = new Localizer({}, { storage: "app.language" });
        } catch (err) {
          error = err as Error;
        }
      });

      then("no error is thrown", () => {
        expect(error).toBeUndefined();
      });

      then("`localizer.language` is seeded from the browser language", () => {
        const language = navigator.language.split("-")[0].toLowerCase();
        expect(localizer.language).toBe(language);
      });
    });
  });

  given("`localStorage.getItem` is observed", () => {
    let getItem: jasmine.Spy;
    beforeEach(() => {
      getItem = spyOn(localStorage, "getItem").and.callThrough();
    });

    and("Localizer instantiated without `storage`", () => {
      beforeEach(() => {
        new Localizer({});
      });

      then("`localStorage.getItem` is not called", () => {
        expect(getItem).not.toHaveBeenCalled();
      });
    });
  });

  given("`localStorage.setItem` is observed", () => {
    let setItem: jasmine.Spy;
    beforeEach(() => {
      setItem = spyOn(localStorage, "setItem").and.callThrough();
      spyOn(localStorage, "getItem").and.returnValue("nl");
    });

    and("Localizer instantiated with `{ storage: \"app.language\" }` and initialized", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer({}, { storage: "app.language" });
        localizer.initialize();
      });
      afterEach(() => {
        localizer.dispose();
      });

      when("`localizer.setLanguage(\"de\")` is called", () => {
        beforeEach(() => {
          localizer.setLanguage("de");
        });

        then("`localStorage.setItem` is not called", () => {
          expect(setItem).not.toHaveBeenCalled();
        });
      });

      when("window dispatches `onappconfigchange` with `{ language: \"fr\" }`", () => {
        beforeEach(() => {
          window.dispatchEvent(
            new CustomEvent(Gesture.ON_APP_CONFIG_CHANGE, {
              detail: { language: "fr" },
            }),
          );
        });

        then("`localizer.language` is `\"fr\"`", () => {
          expect(localizer.language).toBe("fr");
        });

        then("`localStorage.setItem` is not called", () => {
          expect(setItem).not.toHaveBeenCalled();
        });
      });
    });
  });

  given("`onlanguagechange` is observed on `Localizer.prototype`", () => {
    let dispatchEvent: jasmine.Spy;
    beforeEach(() => {
      dispatchEvent = spyOn(
        Localizer.prototype,
        "dispatchEvent",
      ).and.callThrough();
      spyOn(localStorage, "getItem").and.returnValue("nl");
    });

    and("Localizer instantiated with `{ storage: \"app.language\" }` as options", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer({}, { storage: "app.language" });
      });

      then("`localizer.language` is seeded to `\"nl\"`", () => {
        expect(localizer.language).toBe("nl");
      });

      then("no event is dispatched", () => {
        expect(dispatchEvent).not.toHaveBeenCalled();
      });
    });
  });

  given("Localizer instantiated with `42` as options", () => {
    let error: Error;
    beforeEach(() => {
      try {
        // @ts-expect-error
        new Localizer({}, 42);
      } catch (err) {
        error = err as Error;
      }
    });

    then("an error is thrown", () => {
      expect(error).toBeDefined();
    });

    then("error message is `Invalid options value: 42`", () => {
      expect(error.message).toBe("Invalid options value: 42");
    });
  });
});

state(State.LEXICON, () => {
  given("Localizations defined", () => {
    let localizations: Localizations<object>;
    beforeEach(() => {
      localizations = {
        en: { greeting: "Hello" },
        de: { greeting: "Hallo" },
      };
    });

    and("localizer instantiated with localizations", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer(localizations);
      });

      then("localizer.lexicon getter is defined", () => {
        expect(localizer.lexicon).toBeDefined();
      });

      and("localizer.setLanguage called with existing language", () => {
        let language: string;
        beforeEach(() => {
          language = "de";
          localizer.setLanguage(language);
        });

        then("localizer.lexicon is lexicon for language", () => {
          expect(localizer.lexicon).toBe(localizations[language]!);
        });
      });
      and("localizer.setLanguage called with non-existing language", () => {
        let language: string;
        beforeEach(() => {
          language = "fr";
          localizer.setLanguage(language);
        });

        then("localizer.lexicon is lexicon for 'en'", () => {
          expect(localizer.lexicon).toBe(localizations.en!);
        });
      });
    });
  });

  given("Localizations defined without 'en'", () => {
    let localizations: Localizations<object>;
    beforeEach(() => {
      localizations = {
        de: { greeting: "Hallo" },
        fr: { greeting: "Bonjour" },
      };
    });

    and("localizer instantiated with localizations", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer(localizations);
      });

      and("localizer.setLanguage called with non-existing language", () => {
        let language: string;
        beforeEach(() => {
          language = "es";
          localizer.setLanguage(language);
        });

        then("localizer.lexicon is first available lexicon", () => {
          expect(localizer.lexicon).toBe(localizations.de!);
        });
      });
    });
  });

  given("Localizations defined without any lexicon bundle", () => {
    let localizations: Localizations<object>;
    beforeEach(() => {
      localizations = {};
    });

    and("localizer instantiated with localizations", () => {
      let localizer: Localizer<object>;
      beforeEach(() => {
        localizer = new Localizer(localizations);
      });

      then("localizer.lexicon throws error", () => {
        expect(() => localizer.lexicon).toThrowError(
          "Localizer: no localization bundles are available.",
        );
      });
    });
  });
});

operation(Operation.INITIALIZE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    let addEventListener: jasmine.Spy;
    beforeEach(() => {
      localizer = new Localizer({});
      addEventListener = spyOn(window, "addEventListener").and.callThrough();
    });
    afterEach(() => {
      localizer.dispose();
    });

    then("`localizer.initialize` method exists", () => {
      expect(localizer.initialize).toBeDefined();
    });

    and("`localizer.initialize` method exists", () => {
      when("invoking `localizer.initialize`", () => {
        beforeEach(() => {
          localizer.initialize();
        });

        then("an `onappconfigchange` listener is added to `window`", () => {
          expect(
            listenerCalls(addEventListener, Gesture.ON_APP_CONFIG_CHANGE),
          ).toBe(1);
        });

        when("window dispatches `onappconfigchange` with `{ language: \"de\" }`", () => {
          beforeEach(() => {
            window.dispatchEvent(
              new CustomEvent(Gesture.ON_APP_CONFIG_CHANGE, {
                detail: { language: "de" },
              }),
            );
          });

          then("`localizer.language` is `\"de\"`", () => {
            expect(localizer.language).toBe("de");
          });
        });

        when("invoking `localizer.initialize` again", () => {
          beforeEach(() => {
            localizer.initialize();
          });

          then("no second `onappconfigchange` listener is added", () => {
            expect(
              listenerCalls(addEventListener, Gesture.ON_APP_CONFIG_CHANGE),
            ).toBe(1);
          });
        });
      });
    });
  });
});

operation(Operation.DISPOSE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    let removeEventListener: jasmine.Spy;
    beforeEach(() => {
      localizer = new Localizer({});
      removeEventListener = spyOn(
        window,
        "removeEventListener",
      ).and.callThrough();
    });
    afterEach(() => {
      localizer.dispose();
    });

    then("`localizer.dispose` method exists", () => {
      expect(localizer.dispose).toBeDefined();
    });

    and("`localizer.dispose` method exists", () => {
      when("invoking `localizer.dispose` without `initialize`", () => {
        beforeEach(() => {
          localizer.dispose();
        });

        then("no `onappconfigchange` listener is removed from `window`", () => {
          expect(
            listenerCalls(removeEventListener, Gesture.ON_APP_CONFIG_CHANGE),
          ).toBe(0);
        });
      });

      and("`localizer.initialize` was invoked", () => {
        beforeEach(() => {
          localizer.initialize();
        });

        when("invoking `localizer.dispose`", () => {
          let language: string;
          beforeEach(() => {
            localizer.dispose();
            language = localizer.language;
          });

          then("the `onappconfigchange` listener is removed from `window`", () => {
            expect(
              listenerCalls(removeEventListener, Gesture.ON_APP_CONFIG_CHANGE),
            ).toBe(1);
          });

          when("window dispatches `onappconfigchange` with `{ language: \"de\" }`", () => {
            beforeEach(() => {
              window.dispatchEvent(
                new CustomEvent(Gesture.ON_APP_CONFIG_CHANGE, {
                  detail: { language: "de" },
                }),
              );
            });

            then("`localizer.language` is unchanged", () => {
              expect(localizer.language).toBe(language);
            });
          });
        });
      });
    });
  });
});

operation(Operation.SET_LANGUAGE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({});
    });

    then("localizer.setLanguage method is defined", () => {
      expect(localizer.setLanguage).toBeDefined();
    });

    and("localizer.setLanguage method is defined", () => {
      when("localizer.setLanguage is called with language", () => {
        let language: string;
        beforeEach(() => {
          language = "de";
          localizer.setLanguage(language);
        });
        then("localizer.language is set to language", () => {
          expect(localizer.language).toBe(language);
        });
      });

      when("localizer.setLanguage is called with no language", () => {
        let language: string;
        beforeEach(() => {
          language = null as unknown as string;
          localizer.setLanguage(language);
        });
        then("localizer.language is not changed", () => {
          const language = navigator.language.split("-")[0].toLowerCase();
          expect(localizer.language).toBe(language);
        });
      });
    });
  });
});

events(Event.ON_LANGUAGE_CHANGE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({});
    });

    then("localizer.onlanguagechange setter is defined", () => {
      expect(hasSetter(localizer, "onlanguagechange")).toBe(true);
    });

    and("localizer.onlanguagechange setter is defined", () => {
      and("localizer.onlanguagechange is set to handler", () => {
        let handler: jasmine.Spy;
        beforeEach(() => {
          handler = jasmine.createSpy("handler");
          localizer.onlanguagechange = handler;
        });

        when("localizer.language is set to  language", () => {
          let language: string;
          beforeEach(() => {
            language = "de";
            localizer.language = language;
          });

          then("handler is called with language", () => {
            expect(handler).toHaveBeenCalledWith(
              jasmine.objectContaining({
                detail: { language },
              }),
            );
          });
        });

        when("localizer.language is set to existing language", () => {
          let language: string;
          beforeEach(() => {
            language = localizer.language;
            localizer.language = language;
          });

          then("handler is not called", () => {
            expect(handler).not.toHaveBeenCalled();
          });
        });

        and("localizer.onlanguagechange is set to handler2", () => {
          let handler2: jasmine.Spy;
          beforeEach(() => {
            handler2 = jasmine.createSpy("handler2");
            localizer.onlanguagechange = handler2;
          });

          when("localizer.language is set to  language", () => {
            let language: string;
            beforeEach(() => {
              language = "de";
              localizer.language = language;
            });

            then("handler is not called", () => {
              expect(handler).not.toHaveBeenCalled();
            });

            then("handler2 is called with language", () => {
              expect(handler2).toHaveBeenCalledWith(
                jasmine.objectContaining({
                  detail: { language },
                }),
              );
            });
          });
        });
      });
    });
  });
});

gesture(Gesture.ON_APP_CONFIG_CHANGE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer({});
    });
    and("localizer.initialize is called", () => {
      beforeEach(() => {
        localizer.initialize();
      });

      and("localizer.language is set to english", () => {
        beforeEach(() => {
          localizer.language = "en";
        });

        and(
          "window dispatches ON_APP_CONFIG_CHANGE event with language in detail",
          () => {
            let language: string;
            beforeEach(() => {
              language = "de";
              window.dispatchEvent(
                new CustomEvent(Gesture.ON_APP_CONFIG_CHANGE, {
                  detail: { language },
                }),
              );
            });

            then("localizer.language is set to language", () => {
              expect(localizer.language).toBe(language);
            });
          },
        );
      });
    });
  });
});
