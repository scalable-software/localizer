import { Data, State, Validate } from "@scalable.software/localizer";

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

      and("`value` is `42`", () => {
        let value: any;
        beforeEach(() => {
          value = 42;
        });

        when("`Validate.language(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.language(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          and("an error is thrown", () => {
            then("error message is `Invalid language value: 42`", () => {
              expect((error as Error).message).toEqual(
                "Invalid language value: 42",
              );
            });
          });
        });
      });
    });
  });
});

validation(Data.LOCALIZATIONS, () => {
  given("Validate imported", () => {
    then("`Validate` exists", () => {
      expect(Validate).toBeDefined();
    });

    and("`Validate` exists", () => {
      then("`Validate.localizations` static method exists", () => {
        expect(Validate.localizations).toBeDefined();
      });

      and("`value` is a record", () => {
        let value: any;
        beforeEach(() => {
          value = { en: { greeting: "Hello" } };
        });

        when("`Validate.localizations(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.localizations(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `value`", () => {
            expect(result).toBe(value);
          });
        });
      });

      and("`value` is `null`", () => {
        let value: any;
        beforeEach(() => {
          value = null;
        });

        when("`Validate.localizations(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.localizations(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          and("an error is thrown", () => {
            then("error message is `Invalid localizations value: null`", () => {
              expect((error as Error).message).toEqual(
                "Invalid localizations value: null",
              );
            });
          });
        });
      });
    });
  });
});

validation(Data.OPTIONS, () => {
  given("Validate imported", () => {
    then("`Validate` exists", () => {
      expect(Validate).toBeDefined();
    });

    and("`Validate` exists", () => {
      then("`Validate.options` static method exists", () => {
        expect(Validate.options).toBeDefined();
      });

      and("`value` is `{ language: \"de\", storage: \"app.language\" }`", () => {
        let value: any;
        beforeEach(() => {
          value = { language: "de", storage: "app.language" };
        });

        when("`Validate.options(value)` is called", () => {
          let error: unknown | undefined;
          let result: any;
          beforeEach(() => {
            try {
              result = Validate.options(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("result is `value`", () => {
            expect(result).toBe(value);
          });
        });
      });

      and("`value` is `null`", () => {
        let value: any;
        beforeEach(() => {
          value = null;
        });

        when("`Validate.options(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.options(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          and("an error is thrown", () => {
            then("error message is `Invalid options value: null`", () => {
              expect((error as Error).message).toEqual(
                "Invalid options value: null",
              );
            });
          });
        });
      });

      and("`value` is `{ storage: 42 }`", () => {
        let value: any;
        beforeEach(() => {
          value = { storage: 42 };
        });

        when("`Validate.options(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.options(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          and("an error is thrown", () => {
            then(
              "error message is `Invalid options value: storage is invalid`",
              () => {
                expect((error as Error).message).toEqual(
                  "Invalid options value: storage is invalid",
                );
              },
            );
          });
        });
      });
    });
  });
});
