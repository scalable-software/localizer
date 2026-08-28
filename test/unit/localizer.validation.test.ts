import { State, Validate } from "@scalable.software/localizer";

validation(State.LANGUAGE, () => {
  given("Validate imported", () => {
    then("`Validate` exists", () => {
      expect(Validate).toBeDefined();
    });

    and("`Validate` exists", () => {
      then("`Validate.language` static method exists", () => {
        expect(Validate.language).toBeDefined();
      });
    });
  });
});
