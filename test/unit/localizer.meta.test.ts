import {
  Data,
  State,
  Operation,
  Event,
  Gesture,
} from "@scalable.software/localizer";

// Data
metadata(Metadata.DATA, () => {
  and("Data imported", () => {
    then("Data is defined", () => {
      expect(Data).toBeDefined();
    });

    and("Data is defined", () => {
      then("Data is an object", () => {
        expect(typeof Data).toBe("object");
      });

      when("Data is an object", () => {
        then("`Data.LOCALIZATIONS` exists", () => {
          expect(Data.LOCALIZATIONS).toBeDefined();
        });

        then("`Data.OPTIONS` exists", () => {
          expect(Data.OPTIONS).toBeDefined();
        });
      });
    });
  });
});

// State
metadata(Metadata.STATE, () => {
  and("State imported", () => {
    then("State is defined", () => {
      expect(State).toBeDefined();
    });

    and("State is defined", () => {
      then("State is an object", () => {
        expect(typeof State).toBe("object");
      });

      when("State is an object", () => {
        then("`State.LANGUAGE` exists", () => {
          expect(State.LANGUAGE).toBeDefined();
        });

        then("`State.LEXICON` exists", () => {
          expect(State.LEXICON).toBeDefined();
        });
      });
    });
  });
});

// Operation
metadata(Metadata.OPERATION, () => {
  and("Operation imported", () => {
    then("Operation is defined", () => {
      expect(Operation).toBeDefined();
    });

    and("Operation is defined", () => {
      then("Operation is an object", () => {
        expect(typeof Operation).toBe("object");
      });

      when("Operation is an object", () => {
        then("`Operation.INITIALIZE` exists", () => {
          expect(Operation.INITIALIZE).toBeDefined();
        });

        then("`Operation.DISPOSE` exists", () => {
          expect(Operation.DISPOSE).toBeDefined();
        });

        then("`Operation.SET_LANGUAGE` exists", () => {
          expect(Operation.SET_LANGUAGE).toBeDefined();
        });
      });
    });
  });
});

// Event
metadata(Metadata.EVENT, () => {
  and("Event imported", () => {
    then("Event is defined", () => {
      expect(Event).toBeDefined();
    });

    and("Event is defined", () => {
      then("Event is an object", () => {
        expect(typeof Event).toBe("object");
      });

      when("Event is an object", () => {
        then("`Event.ON_LANGUAGE_CHANGE` exists", () => {
          expect(Event.ON_LANGUAGE_CHANGE).toBeDefined();
        });
      });
    });
  });
});

// Gesture
metadata(Metadata.GESTURE, () => {
  and("Gesture imported", () => {
    then("Gesture is defined", () => {
      expect(Gesture).toBeDefined();
    });

    and("Gesture is defined", () => {
      then("Gesture is an object", () => {
        expect(typeof Gesture).toBe("object");
      });

      when("Gesture is an object", () => {
        then("`Gesture.ON_APP_CONFIG_CHANGE` exists", () => {
          expect(Gesture.ON_APP_CONFIG_CHANGE).toBeDefined();
        });
      });
    });
  });
});
