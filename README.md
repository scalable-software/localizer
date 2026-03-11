![License: CC BY-NC-SA 4.0](https://flat.badgen.net/static/license/CC-BY-NC-SA-4.0/green)

# Localizer Documentation

Below is a comprehensive document detailing the Localizer utility's architecture, usage, and development workflow. It prioritizes a quick start so you can see localization resolution immediately, then explains the Localizer's data model, state, operations, events, and app-level synchronization behavior.

---

## 1. Introduction

The **Localizer** utility provides a small, predictable localization layer for web components and related UI code. It stores language bundles, resolves the active lexicon from the current language, listens for global application language changes, and emits an event when the language changes.

Unlike a custom element, the Localizer is an **EventTarget-based utility** rather than a DOM component. Its job is to keep language resolution logic simple and explicit while integrating cleanly with the rest of the Scalable.Software component ecosystem.

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

3. **Run tests (optional)**

   ```bash
   npm test
   ```

   - Ensures the Localizer's state resolution, events, and gesture integration behave as expected.

4. **Start the demo**

   ```bash
   npm run serve
   ```

   - Opens the demo page and runs a minimal example in the browser console.

---

## 2. Quick Start Usage Walkthrough

This walkthrough demonstrates the simplest usage of the Localizer before diving into its internal design.

1. **Import** the Localizer:

   ```js
   import { Localizer } from "@scalable.software/localizer";
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

4. **Read** the resolved lexicon:

   ```js
   console.log(localizer.lexicon.greeting);
   ```

   - Expected output: `Hallo`

5. **Listen** for language changes:

   ```js
   localizer.onlanguagechange = (event) => {
     console.log("Language changed:", event.detail.language);
   };
   ```

6. **Update** the language imperatively:

   ```js
   localizer.setLanguage("en");
   console.log(localizer.lexicon.greeting);
   ```

   - Expected output: `Hello`

7. **Optionally sync** with application-level language changes:

   ```js
   localizer.initialize();

   window.dispatchEvent(
     new CustomEvent("onappconfigchange", {
       detail: { language: "de" },
     }),
   );
   ```

    This updates the Localizer's active language from the global event.

For more details on **data resolution**, **state**, **operations**, and **events**, consult the sections below or generate the API documentation with `npm run document`.

---

## 3. Architectural Overview

### 3.1 Composition

- **Metadata** (`localizer.meta.ts`): Defines public constants and types for data, state, operations, events, gestures, and localization bundles.

- **Class** (`localizer.ts`): Implements the EventTarget-based Localizer, including language normalization, lexicon resolution, event dispatch, and application event integration.

- **Entry Point** (`index.ts`): Re-exports the Localizer and its public metadata surface.

> **Separation of Concerns**
>
> - **Metadata** for shared names and contracts
> - **TypeScript** for runtime behavior
> - **Tests** for public API verification

### 3.2 Lifecycle

The Localizer has a simple operational lifecycle:

- **Construction**

1. Stores the provided localization bundles.
2. Normalizes the initial language code.

- **`initialize()`**

1. Registers a global listener for `onappconfigchange`.
2. Marks the instance as initialized.

- **`dispose()`**

1. Removes the global `onappconfigchange` listener.
2. Marks the instance as no longer initialized.

Because Localizer is not a custom element, listener management is explicit rather than tied to `connectedCallback()` or `disconnectedCallback()`.

---

## 4. Core Concepts: Data, State, Operations, Events, and Gestures

After seeing the Localizer in action, the following sections explain how it works internally.

### 4.1 Data

The Localizer stores language bundles in a `Localizations<T>` map keyed by language code.

#### 4.1.1 Definition

- **`localizations`**
- A record of language codes mapped to lexicon objects.
- Example:

```ts
type Localizations<T extends object> = Record<string, T | undefined>;
```

#### 4.1.2 Resolution Order

When `lexicon` is read, the Localizer resolves bundles in this order:

1. The current language value
2. English (`en`)
3. The first available bundle

If no bundle exists, the Localizer throws an error.

### 4.2 State

The Localizer exposes two key state concepts: the active language and the resolved lexicon.

#### 4.2.1 Definition

- **`language`** (`string`)
  - The active language used for lexicon lookup.
  - Defaults to `navigator.language`, normalized to the base lowercase language during construction.
  - Example: an initial language of `en-US` becomes `en`.
  - Later assignments through `language` or `setLanguage()` are stored as provided.

- **`lexicon`** (`T`)
  - The resolved bundle for the current language.
  - Falls back to English or the first available bundle when necessary.

#### 4.2.2 Internal vs. Resolved State

1. **Internal state**

   ```ts
   private _language: string;
   ```

   This stores the active language used for lookup.

2. **Resolved state**

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

- Keeps lookup behavior predictable even when a bundle is missing.

#### 4.2.3 Usage Tips

- Prefer base language codes such as `en`, `de`, and `fr` when setting `language` after construction.
- Provide an `en` bundle if you want a stable fallback.
- Treat `lexicon` as the primary runtime API for reading localized values.

### 4.3 Operations

The Localizer exposes a small imperative API for lifecycle and language updates.

#### 4.3.1 Definition

1. `initialize()` -> register global app configuration listeners
2. `dispose()` -> remove global app configuration listeners
3. `setLanguage(language)` -> update the active language

#### 4.3.2 Example

```ts
public setLanguage = (language: string) => (this.language = language);
```

### 4.4 Events

The Localizer emits a custom event when its active language changes.

#### 4.4.1 Definition

- **`onlanguagechange`**: Fired when `language` changes to a new truthy value.
- Event payload:

  ```js
  {
    detail: {
      language: "de";
    }
  }
  ```

#### 4.4.2 Usage Tips

- Assign a handler:

  ```js
  localizer.onlanguagechange = (event) => {
    console.log(event.detail.language);
  };
  ```

- Or use the standard EventTarget API:

  ```js
  localizer.addEventListener("onlanguagechange", (event) => {
    console.log(event.detail.language);
  });
  ```

### 4.5 Gestures

The Localizer integrates with one application-level gesture.

#### 4.5.1 Definition

- **`onappconfigchange`**
  - A window-level custom event.
  - If `detail.language` is present, the Localizer updates its active language.
  - The event is only observed after `initialize()` has been called.

#### 4.5.2 Example

```js
window.dispatchEvent(
  new CustomEvent("onappconfigchange", {
    detail: { language: "fr" },
  }),
);
```

---

## 5. Development Workflow

Below is a recommended workflow for building, testing, documenting, and publishing the Localizer package.

### 5.1 From Specifications to Implementation

1. Define the package contract and localization behavior in the specifications file.
2. Implement the runtime API in TypeScript.
3. Re-export the public surface from the package entry point.

### 5.2 Testing

- Unit tests use Karma + Jasmine.
- Coverage includes data storage, state changes, lexicon fallback, operations, events, and global gesture handling.
- Run tests with:

```bash
npm test
```

### 5.3 Demo

Run the demo locally with:

```bash
npm run serve
```

- The demo provides a minimal browser example using the public package import.

### 5.4 Documentation

Generate API documentation with:

```bash
npm run document
```

- This builds the docs from TypeScript annotations.

### 5.5 Publishing & Versioning

1. **Build**

   ```bash
   npm run build
   ```

   - Outputs the distributable package to `dist/`.

2. **Bump version**

   ```bash
   npm version [major|minor|patch]
   ```

3. **Publish**

   ```bash
   npm publish
   ```

---

## 6. Best Practices & Extensibility

1. **Keep bundles small**
   - Store only the localized values needed by the consuming component or view.

2. **Normalize consistently**
   - Use base language codes such as `en`, `de`, and `fr` for predictable lookups.

3. **Provide fallbacks deliberately**
   - Include an English bundle when you want stable fallback behavior.

4. **Manage listeners explicitly**
   - Call `initialize()` only when you need app-level synchronization.
   - Call `dispose()` when the Localizer instance is no longer needed.

5. **Test public behavior**
   - Verify language changes, fallback resolution, and emitted event payloads rather than internal implementation details.

---

## 7. Conclusion

The Localizer provides a compact, explicit localization primitive for Scalable.Software projects. By combining predictable bundle resolution, a small imperative API, and optional synchronization with application configuration changes, it keeps localization behavior easy to test and easy to integrate.

Follow the development workflow for testing, documentation, and publishing to maintain a stable public API as the package evolves.

---

### License

> This software and its documentation are released under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International** (CC BY-NC-SA 4.0) license.
> For more details, please visit the full [license agreement](https://creativecommons.org/licenses/by-nc-sa/4.0/).
