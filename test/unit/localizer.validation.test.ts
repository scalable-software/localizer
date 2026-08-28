import { State, Validate } from "@scalable.software/localizer";

validation(State.LANGUAGE, () => {
  given("Validate imported", () => {
    then("`Validate` exists", () => {
      expect(Validate).toBeDefined();
    });
  });
});
