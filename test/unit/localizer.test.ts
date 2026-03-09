import {
  Localizer,
  LocalizerEvent,
  LocalizerGesture,
  type LocalizationDictionary,
} from "@scalable.software/localizer";

type Localization = {
  placeholder: {
    title: string;
  };
  action: {
    save: string;
    cancel: string;
  };
};

const localizations: LocalizationDictionary<Localization> = {
  en: {
    placeholder: {
      title: "Clinical Pathway Name",
    },
    action: {
      save: "Save",
      cancel: "Cancel",
    },
  },
  de: {
    placeholder: {
      title: "Name des klinischen Pfads",
    },
    action: {
      save: "Speichern",
      cancel: "Abbrechen",
    },
  },
};

configuration("Localizer", () => {
  and("Localizer imported", () => {
    then("Localizer is defined", () => {
      expect(Localizer).toBeDefined();
    });

    and("Localizer is defined", () => {
      then("LocalizerEvent is defined", () => {
        expect(LocalizerEvent).toBeDefined();
      });

      then("LocalizerGesture is defined", () => {
        expect(LocalizerGesture).toBeDefined();
      });
    });
  });
});

configuration("Instantiation", () => {
  and("localizations are defined", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer(localizations, "de");
    });

    then("localizer is defined", () => {
      expect(localizer).toBeDefined();
    });

    then("localizer is an EventTarget", () => {
      expect(localizer).toBeInstanceOf(EventTarget);
    });

    then("localizer.language is constructor language", () => {
      expect(localizer.language).toBe("de");
    });
  });
});

state("language", () => {
  and("a localizer is instantiated", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer(localizations, "en");
    });

    then("language getter is defined", () => {
      expect(localizer.language).toBeDefined();
    });

    and("language is updated via setter", () => {
      beforeEach(() => {
        localizer.language = "de";
      });

      then("language is updated", () => {
        expect(localizer.language).toBe("de");
      });
    });
  });
});

events("ON_LANGUAGE_CHANGE", () => {
  and("a localizer is instantiated", () => {
    let localizer: Localizer<Localization>;
    let count = 0;
    let detailLanguage: string | undefined;

    beforeEach(() => {
      count = 0;
      detailLanguage = undefined;

      localizer = new Localizer(localizations, "en");
      localizer.onlanguagechange = (event: Event) => {
        count += 1;
        detailLanguage = (event as CustomEvent<{ language: string }>).detail
          .language;
      };
    });

    and("language changes via setter", () => {
      beforeEach(() => {
        localizer.language = "de";
      });

      then("onlanguagechange is triggered", () => {
        expect(count).toBe(1);
      });

      then("event detail contains updated language", () => {
        expect(detailLanguage).toBe("de");
      });
    });

    and("language is set to same value", () => {
      beforeEach(() => {
        localizer.language = "en";
      });

      then("onlanguagechange is not triggered", () => {
        expect(count).toBe(0);
      });
    });
  });
});

data("localization", () => {
  and("a localizer is instantiated with exact language match", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer(localizations, "de");
    });

    then("exact localization bundle is returned", () => {
      expect(localizer.localization).toBe(localizations.de);
    });
  });

  and("a localizer is instantiated with regional language", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer(localizations, "de-DE");
    });

    then("base language localization bundle is returned", () => {
      expect(localizer.localization).toBe(localizations.de);
    });
  });

  and("a localizer is instantiated with unsupported language", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer(localizations, "fr");
    });

    then("english localization bundle is returned", () => {
      expect(localizer.localization).toBe(localizations.en);
    });
  });
});

operation("setLanguage", () => {
  and("a localizer is instantiated", () => {
    let localizer: Localizer<Localization>;
    let count = 0;

    beforeEach(() => {
      count = 0;

      localizer = new Localizer(localizations, "en");
      localizer.onlanguagechange = () => {
        count += 1;
      };
    });

    and("setLanguage is called", () => {
      beforeEach(() => {
        localizer.setLanguage("de");
      });

      then("language is updated", () => {
        expect(localizer.language).toBe("de");
      });

      then("language change event is emitted", () => {
        expect(count).toBe(1);
      });
    });
  });
});

operation("initialize", () => {
  and("a localizer is instantiated", () => {
    let localizer: Localizer<Localization>;
    let count = 0;

    beforeEach(() => {
      count = 0;

      localizer = new Localizer(localizations, "en");
      localizer.onlanguagechange = () => {
        count += 1;
      };
    });

    afterEach(() => {
      localizer.dispose();
    });

    and("localizer is initialized", () => {
      beforeEach(() => {
        localizer.initialize();
      });

      and("appconfigchange event is dispatched on window", () => {
        beforeEach(() => {
          window.dispatchEvent(
            new CustomEvent(LocalizerGesture.APP_CONFIG_CHANGE, {
              detail: { language: "de" },
            }),
          );
        });

        then("language is updated from app config event", () => {
          expect(localizer.language).toBe("de");
        });

        then("language change event is emitted", () => {
          expect(count).toBe(1);
        });
      });
    });
  });
});

operation("dispose", () => {
  and("a localizer is instantiated", () => {
    let localizer: Localizer<Localization>;
    let count = 0;

    beforeEach(() => {
      count = 0;

      localizer = new Localizer(localizations, "en");
      localizer.onlanguagechange = () => {
        count += 1;
      };

      localizer.initialize();
      localizer.dispose();
    });

    and("appconfigchange event is dispatched after dispose", () => {
      beforeEach(() => {
        window.dispatchEvent(
          new CustomEvent(LocalizerGesture.APP_CONFIG_CHANGE, {
            detail: { language: "de" },
          }),
        );
      });

      then("language is not updated", () => {
        expect(localizer.language).toBe("en");
      });

      then("language change event is not emitted", () => {
        expect(count).toBe(0);
      });
    });
  });
});
