import {
  Localizer,
  State,
  Operation,
  Event,
} from "@scalable.software/localizer";

state(State.LANGUAGE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer();
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

operation(Operation.SET_LANGUAGE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer();
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
      localizer = new Localizer();
    });

    then("localizer.onlanguagechange setter is defined", () => {
      expect(hasSetter(localizer, "onlanguagechange")).toBe(true);
    });
  });
});
