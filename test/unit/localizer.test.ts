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
      localizer = new Localizer(localizations, "de-DE");
    });

    then("localizer is defined", () => {
      expect(localizer).toBeDefined();
    });

    then("localizer is an EventTarget", () => {
      expect(localizer).toBeInstanceOf(EventTarget);
    });

    then("localizer.language is normalized from constructor language", () => {
      expect(localizer.language).toBe("de");
    });
  });

  and("constructor receives a normalized language", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer(localizations, "en");
    });

    then("localizer.language stores the provided value", () => {
      expect(localizer.language).toBe("en");
    });
  });

  and("constructor language is omitted", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      spyOnProperty(window.navigator, "language", "get").and.returnValue(
        "en-US",
      );

      localizer = new Localizer(localizations);
    });

    then("localizer.language uses normalized navigator.language", () => {
      expect(localizer.language).toBe("en");
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

      then("event detail contains assigned language", () => {
        expect(detailLanguage).toBe("de");
      });
    });

    and("language is set to the current value", () => {
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
  and("a localizer is instantiated with a normalized language key", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer(localizations, "de-DE");
    });

    then("the normalized localization bundle is returned", () => {
      expect(localizer.localization).toBe(localizations.de);
    });
  });

  and("a localizer is instantiated with unsupported language", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer(localizations, "fr-FR");
    });

    then("english localization bundle is returned", () => {
      expect(localizer.localization).toBe(localizations.en);
    });
  });

  and("english is unavailable", () => {
    let localizer: Localizer<Localization>;

    const nonEnglishLocalizations: LocalizationDictionary<Localization> = {
      de: localizations.de,
      fr: {
        placeholder: {
          title: "Nom du parcours clinique",
        },
        action: {
          save: "Enregistrer",
          cancel: "Annuler",
        },
      },
    };

    beforeEach(() => {
      localizer = new Localizer(nonEnglishLocalizations, "es-ES");
    });

    then("the first available localization bundle is returned", () => {
      expect(localizer.localization).toBe(localizations.de);
    });
  });

  and("no localization bundles are available", () => {
    let localizer: Localizer<Localization>;

    beforeEach(() => {
      localizer = new Localizer({}, "en-US");
    });

    then("reading localization throws", () => {
      expect(() => localizer.localization).toThrowError(
        "Localizer: no localization bundles are available.",
      );
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
        localizer.setLanguage("de-DE");
      });

      then("language is normalized and updated", () => {
        expect(localizer.language).toBe("de");
      });

      then("language change event is emitted", () => {
        expect(count).toBe(1);
      });
    });

    and("setLanguage normalizes to the current value", () => {
      beforeEach(() => {
        localizer.setLanguage("en-US");
      });

      then("language change event is not emitted", () => {
        expect(count).toBe(0);
      });
    });
  });
});

operation("initialize", () => {
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
              detail: { language: "de-DE" },
            }),
          );
        });

        then("language is normalized from app config event", () => {
          expect(localizer.language).toBe("de");
        });

        then("language change event is emitted", () => {
          expect(count).toBe(1);
        });

        then("language change event detail is normalized", () => {
          expect(detailLanguage).toBe("de");
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
