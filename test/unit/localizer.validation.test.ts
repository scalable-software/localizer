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

      and("`value` is `\"de\"`", () => {
        let value: any;
        beforeEach(() => {
          value = "de";
        });

        when("`Validate.language(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.language(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `\"de\"`", () => {
            expect(result).toBe("de");
          });
        });
      });
    });
  });
});
