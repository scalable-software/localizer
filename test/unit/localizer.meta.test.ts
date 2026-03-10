import { State, Operation } from "@scalable.software/localizer";

metadata("States", () => {
  and("State imported", () => {
    then("State is defined", () => {
      expect(State).toBeDefined();
    });

    when("State is defined", () => {
      then("State is an object", () => {
        expect(typeof State).toBe("object");
      });

      and("State is an object", () => {
        then("State has LANGUAGE property", () => {
          expect(State.LANGUAGE).toBe("language");
        });
      });
    });
  });
});

metadata("Operations", () => {
  and("Operation imported", () => {
    then("Operation is defined", () => {
      expect(Operation).toBeDefined();
    });

    when("Operation is defined", () => {
      then("Operation is an object", () => {
        expect(typeof Operation).toBe("object");
      });

      and("Operation is an object", () => {
        then("Operation has SET_LANGUAGE property", () => {
          expect(Operation.SET_LANGUAGE).toBe("setLanguage");
        });
      });
    });
  });
});
