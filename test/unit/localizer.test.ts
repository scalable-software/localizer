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
  });
});
