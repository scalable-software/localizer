![License: CC BY-NC-SA 4.0](https://flat.badgen.net/static/license/CC-BY-NC-SA-4.0/green)

# Localizer Documentation

This document describes the Localizer utility's architecture, usage, and development workflow. It starts with a quick example, then explains the data model, state, operations, events, and synchronization through BroadcastChannel.

---

## 1. Introduction

The **Localizer** utility provides a small, predictable localization layer for web components and related UI code. It stores language bundles, resolves the active lexicon from the current language, receives application language changes through a BroadcastChannel, and emits an event when its language changes.

The Localizer extends **EventTarget**. It keeps language resolution explicit while integrating with the rest of the Scalable.Software component ecosystem.

### 1.1 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/scalable-software/localizer.git
   cd localizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run tests**

   ```bash
   npm test
   ```

   Tests cover language resolution, events, lifecycle operations, and BroadcastChannel integration.

4. **Start the demo**

   ```bash
   npm run serve
   ```

   Use the demo page to explore the Localizer in the browser.

---

## 2. Quick Start Usage Walkthrough

1. **Import** the Localizer and its communication metadata:

   ```js
   import {
     Localizer,
     Channel,
     Gesture,
   } from "@scalable.software/localizer";
   ```

2. **Define** localization bundles:

   ```js
   const localizations = {
     en: { greeting: "Hello" },
     de: { greeting: "Hallo" },
   };
   ```

3. **Instantiate** the Localizer with an initial language:

   ```js
   const localizer = new Localizer(localizations, "de");
   ```

   Alternatively, seed it from a persisted choice, falling back to the browser language:

   ```js
   const localizer = new Localizer(localizations, {
     storage: "app.language",
   });
   ```

   `storage` names a `localStorage` key maintained by your application. The Localizer reads that key during construction when no explicit initial language is supplied. It never writes to storage.

4. **Read** the resolved lexicon:

   ```js
   console.log(localizer.lexicon.greeting);
   ```

   With the explicit `"de"` language above, the output is `Hallo`.

5. **Listen** for language changes:

   ```js
   localizer.onlanguagechange = (event) => {
     console.log("Language changed:", event.detail.language);
   };
   ```

6. **Update** the language directly:

   ```js
   localizer.setLanguage("en");
   console.log(localizer.lexicon.greeting);
   ```

   The output is `Hello`.

7. **Optionally synchronize** with application configuration messages:

   ```js
   localizer.initialize();

   const configuration = new BroadcastChannel(Channel.CONFIGURATION);

   configuration.postMessage({
     type: Gesture.ON_APP_CONFIG_CHANGE,
     language: "de",
   });
   ```

   The Localizer receives the message asynchronously and updates its language. Its `onlanguagechange` handler runs if the language changes.

   The sender and Localizer use separate BroadcastChannel instances with the same channel name.

8. **Clean up** when the instances are no longer needed:

   ```js
   configuration.close();
   localizer.dispose();
   ```

For more details, consult the sections below or generate the API documentation with `npm run document`.

---

## 3. Architectural Overview

### 3.1 Composition

- **Metadata** (`localizer.meta.ts`): Defines public constants and types for channels, data, state, operations, events, gestures, and localization bundles.
- **Validation** (`localizer.validation.ts`): Validates language values, the localization container, and constructor options.
- **Class** (`localizer.ts`): Implements language normalization, lexicon resolution, local event dispatch, and BroadcastChannel integration.
- **Entry Point** (`index.ts`): Re-exports the Localizer and its public metadata surface.

Responsibilities are divided between:

- **Metadata** for shared names and contracts
- **Validation** for runtime input checks
- **Class implementation** for runtime behavior
- **Tests** for public API verification

### 3.2 Lifecycle

#### Construction

1. Validates and stores the localization bundles.
2. Normalizes and validates the options. A bare string becomes `{ language }`.
3. Resolves the initial language from the explicit option, configured storage key, or browser language.
4. Normalizes the initial language to its base lowercase code.

Construction does not open a BroadcastChannel or emit a language-change event.

#### `initialize()`

1. Opens a BroadcastChannel using `Channel.CONFIGURATION`.
2. Registers a `"message"` listener, identified by `Gesture.MESSAGE`.
3. Marks the instance as initialized.

Calling `initialize()` again while already initialized has no effect.

#### `dispose()`

1. Removes the channel's message listener.
2. Closes the Localizer's BroadcastChannel.
3. Clears the channel reference.
4. Marks the instance as no longer initialized.

Calling `dispose()` before initialization or after disposal has no effect. Calling `initialize()` after disposal opens a new channel and resumes synchronization.

The Localizer manages its own channel only. Application code must close any sender channels it creates.

Listener management is explicit because the Localizer is not a custom element with `connectedCallback()` or `disconnectedCallback()` lifecycle hooks.

---

## 4. Core Concepts: Data, State, Operations, Events, and Gestures

### 4.1 Data

The Localizer stores language bundles in a `Localizations<T>` map keyed by language code.

#### 4.1.1 Definition

**`localizations`**

A record of language codes mapped to lexicon objects:

```ts
type Localizations<T extends object> = Record<string, T | undefined>;
```

The constructor requires a non-null, non-array object. Invalid containers throw:

```text
Invalid localizations value: <value>
```

Individual bundle contents are not validated.

The `localizations` getter exposes the supplied object. The property has no setter, but the returned object is not frozen.

**`options`**

The constructor accepts an options object with two optional fields:

```ts
type Options = {
  language?: string;
  storage?: string;
};
```

- `language` specifies the initial language and takes precedence over storage.
- `storage` specifies the `localStorage` key containing a persisted language.

Storage access is optional:

- Without a configured storage key, the Localizer does not read `localStorage`.
- With an explicit language, storage is not read.
- Otherwise, the configured key is read once during construction.
- An absent or empty stored value falls back to the browser language.
- If storage access throws, the Localizer falls back to the browser language.
- The Localizer never writes to storage.

A non-object, `null`, or array options value throws:

```text
Invalid options value: <value>
```

A defined `language` or `storage` field that is not a string throws:

```text
Invalid options value: <field> is invalid
```

The `options` getter exposes the options object. The property has no setter, but the returned object is not frozen. Changing that object does not rerun initialization or language resolution.

#### 4.1.2 Resolution Order

When `lexicon` is read, the Localizer resolves bundles in this order:

1. The current language value
2. English (`en`)
3. The first available bundle

If no bundle is available, it throws:

```text
Localizer: no localization bundles are available.
```

### 4.2 State

The Localizer exposes the active language and its resolved lexicon.

#### 4.2.1 Definition

**`language`** (`string`)

- Holds the active language used for lexicon lookup.
- Is seeded at construction from:
  1. `options.language`
  2. The persisted value at `options.storage`
  3. `navigator.language`
- The initial value is normalized to its base lowercase code: `en-US` becomes `en`, and `nl-NL` becomes `nl`.
- Construction does not emit `onlanguagechange`.
- Later assignments, including updates received through BroadcastChannel, are stored as provided.
- Falsy assignments are ignored.
- Truthy non-string assignments throw `Invalid language value: <value>`.
- Assigning the current language again does not emit an event.

**`lexicon`** (`T`)

- Returns the resolved bundle for the current language.
- Falls back to English or the first available bundle.
- Does not change `language` when a fallback bundle is used.

#### 4.2.2 Internal vs. Resolved State

The active language is stored internally:

```ts
private _language: string;
```

The lexicon is resolved when accessed:

```ts
public get lexicon(): T {
  const language = this.localizations[this.language];
  if (language) return language;

  const english = this.localizations.en;
  if (english) return english;

  const first = Object.values(this.localizations).find(Boolean);
  if (first) return first;

  throw new Error("Localizer: no localization bundles are available.");
}
```

For example, if `language` is `"fr"` but only an English bundle exists, `lexicon` returns the English bundle while `language` remains `"fr"`.

#### 4.2.3 Usage Tips

- Use base language codes such as `en`, `de`, and `fr` for updates after construction.
- Provide an `en` bundle if you want an English fallback.
- Use `lexicon` to read localized values.
- Namespace the storage key to your application, such as `app.language`, or to the current user, such as `app.<userId>.language`.
- Let the application persist language choices and broadcast configuration messages. The Localizer reads the initial stored choice and receives subsequent messages.

### 4.3 Operations

#### 4.3.1 Definition

1. **`initialize()`** — opens the configuration channel and registers its message listener.
2. **`dispose()`** — removes the listener and closes the Localizer's channel.
3. **`setLanguage(language)`** — delegates to the `language` setter.

Direct language updates work before initialization and after disposal. Initialization is required only for BroadcastChannel synchronization.

Calling `setLanguage()` or assigning `language` does not broadcast a message or persist the value.

#### 4.3.2 Example

```js
localizer.setLanguage("de");
```

This is equivalent to:

```js
localizer.language = "de";
```

### 4.4 Events

The Localizer emits a CustomEvent on its own EventTarget when its active language changes.

#### 4.4.1 Definition

**`onlanguagechange`**

- Identified by `Event.ON_LANGUAGE_CHANGE`.
- Fired after the active language changes to a new accepted value.
- Contains the new language in `event.detail`.
- Is dispatched synchronously by the language setter.
- Is not cancelable and does not broadcast the change to other Localizers.

Example detail:

```js
{
  language: "de"
}
```

When a BroadcastChannel message triggers the update, message delivery is asynchronous. Once the message handler assigns the language, the setter dispatches the local event synchronously.

#### 4.4.2 Usage

Assign a handler:

```js
localizer.onlanguagechange = (event) => {
  console.log(event.detail.language);
};
```

Assigning a new handler replaces the previous handler assigned through this property. Assigning `null` removes it:

```js
localizer.onlanguagechange = null;
```

Alternatively, use the EventTarget API:

```js
const handleLanguageChange = (event) => {
  console.log(event.detail.language);
};

localizer.addEventListener("onlanguagechange", handleLanguageChange);

// Remove this listener when it is no longer needed.
localizer.removeEventListener("onlanguagechange", handleLanguageChange);
```

`dispose()` stops BroadcastChannel synchronization. It does not remove listeners attached to the Localizer's own EventTarget.

### 4.5 Gestures and BroadcastChannel Synchronization

The Localizer receives application configuration messages through `Channel.CONFIGURATION`.

#### 4.5.1 Definition

The communication contract has three parts:

- **Channel name:** `Channel.CONFIGURATION`
- **Native channel event:** `"message"`, identified by `Gesture.MESSAGE`
- **Payload type:** `Gesture.ON_APP_CONFIG_CHANGE`

The `Configuration` type describes the message as far as the Localizer reads it:

```ts
type Configuration = {
  type: typeof Gesture.ON_APP_CONFIG_CHANGE;
  language?: Language;
};
```

Other fields may be present and are ignored. `Configuration` describes what the Localizer accepts, not the message senders should build: the full application message belongs in the application's contract.

Example message:

```js
{
  type: Gesture.ON_APP_CONFIG_CHANGE,
  language: "fr",
}
```

The channel is shared. Other senders post on it, and configuration messages may carry other settings, such as a coding, without a language. A message on the channel is therefore never an error for the Localizer. The Localizer:

1. Receives the payload through `message.data`.
2. Checks it with `Validate.configuration`, which never throws.
3. Ignores, silently, any message that is not an object, is an array, has another `type`, has no `language`, or has a `language` that is not a non-empty string. Ignored messages leave `language` unchanged and emit no `onlanguagechange`.
4. Passes the language of an accepted message to its setter, which ignores a language equal to the current one.

Unrelated, coding-only and malformed messages are ignored without an error.

#### 4.5.2 Example

```js
import {
  Localizer,
  Channel,
  Gesture,
} from "@scalable.software/localizer";

const localizer = new Localizer(
  {
    en: { greeting: "Hello" },
    fr: { greeting: "Bonjour" },
  },
  "en",
);

localizer.onlanguagechange = () => {
  console.log(localizer.lexicon.greeting);
};

localizer.initialize();

const configuration = new BroadcastChannel(Channel.CONFIGURATION);

configuration.postMessage({
  type: Gesture.ON_APP_CONFIG_CHANGE,
  language: "fr",
});

// The handler logs "Bonjour" after the message is delivered.
```

Reuse the sender channel for subsequent configuration changes. Close it when its owner is disposed:

```js
configuration.close();
localizer.dispose();
```

#### 4.5.3 Delivery Behavior

- BroadcastChannel delivers messages asynchronously.
- Participating instances must use the same channel name and compatible same-origin storage contexts.
- A sending BroadcastChannel instance does not receive its own message. Other connected instances can receive it, including instances in the same page.
- Messages sent before the Localizer creates its channel are not replayed when it initializes.
- A disposed Localizer no longer receives channel messages.
- Multiple initialized Localizers can receive the same configuration message.
- A BroadcastChannel also reaches other tabs of the same site, so a language change in one tab updates the Localizers in every open tab.
- The Localizer does not forward received messages back to the channel.

#### 4.5.4 Persisting a Language Choice

The application can persist the choice and announce it using the same language value:

```js
const configuration = new BroadcastChannel(Channel.CONFIGURATION);

const selectLanguage = (language) => {
  localStorage.setItem("app.language", language);

  configuration.postMessage({
    type: Gesture.ON_APP_CONFIG_CHANGE,
    language,
  });
};
```

Handle storage-write failures according to your application's requirements. The Localizer's fallback handling applies only to its own storage reads.

---

## 5. Development Workflow

### 5.1 From Specifications to Implementation

1. Define the package contract and localization behavior in the specifications file.
2. Implement the runtime API in TypeScript.
3. Re-export the public surface from the package entry point.

### 5.2 Testing

Unit tests use Karma + Jasmine.

Coverage includes:

- Constructor options and initial language resolution
- Storage reads and fallback behavior
- Language updates and lexicon resolution
- Language-change events
- Initialization and disposal
- BroadcastChannel message handling
- Ignored message types
- Repeated initialization and disposal
- Absence of storage writes

Run tests with:

```bash
npm test
```

BroadcastChannel tests must wait for delivery before asserting the resulting state. An immediate assertion after `postMessage()` may run before the Localizer receives the message.

When testing a language change, register the event listener before posting:

```ts
const changed = new Promise<void>((resolve) => {
  localizer.addEventListener(
    Event.ON_LANGUAGE_CHANGE,
    () => resolve(),
    { once: true },
  );
});

configuration.postMessage({
  type: Gesture.ON_APP_CONFIG_CHANGE,
  language: "de",
});

await changed;

expect(localizer.language).toBe("de");
```

This example assumes the Localizer is initialized and starts with a different language.

For tests that expect no language-change event, use the suite's asynchronous delivery helper rather than waiting for an event that should not fire.

Close sender channels and dispose Localizers during test cleanup.

### 5.3 Demo

Run the demo locally with:

```bash
npm run serve
```

The demo provides a browser example using the public package import.

### 5.4 Documentation

Generate API documentation with:

```bash
npm run document
```

This builds the API documentation from TypeScript annotations.

### 5.5 Publishing & Versioning

1. **Build**

   ```bash
   npm run build
   ```

   Outputs the distributable package to `dist/`.

2. **Bump the version**

   Choose the appropriate command:

   ```bash
   npm version patch
   npm version minor
   npm version major
   ```

3. **Publish**

   ```bash
   npm publish
   ```

---

## 6. Best Practices & Extensibility

1. **Keep bundles small**
   - Store the localized values needed by the consuming component or view.

2. **Use consistent language codes**
   - Use base codes such as `en`, `de`, and `fr` for updates after construction.

3. **Provide fallbacks deliberately**
   - Include an English bundle when you want English fallback behavior.

4. **Manage channels explicitly**
   - Call `initialize()` when application-level synchronization is needed.
   - Call `dispose()` when synchronization is no longer needed.
   - Close application-owned sender channels separately.

5. **Keep persistence in the application**
   - Let the language-selection component write the stored choice and broadcast the update.
   - Configure each Localizer with the appropriate storage key for its initial value.

6. **Account for asynchronous delivery**
   - React to `onlanguagechange` when updating UI after a broadcast.
   - Wait for message processing in tests before asserting state.

7. **Test public behavior**
   - Verify language changes, fallback resolution, and emitted event payloads.
   - Include lifecycle tests for initialization, disposal, and repeated calls.

---

### License

> This software and its documentation are released under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International** (CC BY-NC-SA 4.0) license.
> For more details, please visit the full [license agreement](https://creativecommons.org/licenses/by-nc-sa/4.0/).