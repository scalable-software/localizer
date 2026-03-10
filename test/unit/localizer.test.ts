import { Localizer, State } from "@scalable.software/localizer";

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
