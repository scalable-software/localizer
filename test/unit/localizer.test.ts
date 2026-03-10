import { Localizer, State } from "@scalable.software/localizer";

state(State.LANGUAGE, () => {
  given("Localizer instantiated", () => {
    let localizer: Localizer<object>;
    beforeEach(() => {
      localizer = new Localizer();
    });

    then("localizer.language is defined", () => {
      expect(localizer.language).toBeDefined();
    });
  });
});
