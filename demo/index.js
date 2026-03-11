import { Localizer } from "@scalable.software/localizer";

const localizations = {
	en: { greeting: "Hello" },
	de: { greeting: "Hallo" },
};

const localizer = new Localizer(localizations, "de");

console.log(localizer.lexicon.greeting);
