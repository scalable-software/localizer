import {
  Localizer,
  Data,
  State,
  Operation,
  Event,
} from "@scalable.software/localizer";

import { type Localizations } from "@scalable.software/localizer";

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

      then("localizer.localizations is localizations", () => {
        expect(localizer["localizations"]).toBe(localizations);
      });
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
          expect(localizer.lexicon).toBe(localizations[language]);
        });
      });
      and("localizer.setLanguage called with non-existing language", () => {
        let language: string;
        beforeEach(() => {
          language = "fr";
          localizer.setLanguage(language);
        });

        then("localizer.lexicon is lexicon for 'en'", () => {
          expect(localizer.lexicon).toBe(localizations.en);
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
          expect(localizer.lexicon).toBe(localizations.de);
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
    beforeEach(() => {
      localizer = new Localizer({});
    });

    then("localizer.initialize method is defined", () => {
      expect(localizer.initialize).toBeDefined();
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
