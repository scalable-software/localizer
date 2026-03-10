import { State } from "@scalable.software/localizer";

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
