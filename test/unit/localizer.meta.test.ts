import {
  Data,
  State,
  Operation,
  Event,
  Gesture,
} from "@scalable.software/localizer";

metadata("Data", () => {
  and("Data imported", () => {
    then("Data is defined", () => {
      expect(Data).toBeDefined();
    });
    when("Data is defined", () => {
      then("Data is an object", () => {
        expect(typeof Data).toBe("object");
      });
      and("Data is an object", () => {
        then("Data has LOCALIZATIONS property", () => {
          expect(Data.LOCALIZATIONS).toBe("localizations");
        });
      });
    });
  });
});

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

        then("State has LEXICON property", () => {
          expect(State.LEXICON).toBe("lexicon");
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

metadata("Events", () => {
  and("Event imported", () => {
    then("Event is defined", () => {
      expect(Event).toBeDefined();
    });

    when("Event is defined", () => {
      then("Event is an object", () => {
        expect(typeof Event).toBe("object");
      });

      and("Event is an object", () => {
        then("Event has ON_LANGUAGE_CHANGE property", () => {
          expect(Event.ON_LANGUAGE_CHANGE).toBe("onlanguagechange");
        });
      });
    });
  });
});
