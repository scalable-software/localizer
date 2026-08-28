# Workflow

This document defines the implementation policy for **branching, commit sequencing, and TDD discipline**. It is the authoritative reference for how work is recorded in git history. The reference standard is the commit history of the `scalable.software/pin` component — the canonical example of this policy applied end to end.

---

# How to Read This Policy

Rules in this policy fall into three strengths:

- **Principles** are non-negotiable: the FAIL-before-PASS ordering, the one-concern-per-commit rule, and the prefix vocabulary.
- **Templates** are invariant skeletons with variation points: the per-layer commit sequences activate per feature depending on which layers the feature touches.
- **Conventions** are canonical defaults: branch naming families, message grammar details. Deviations should be explainable at review time.

---

# 1) Branching

- One feature per branch. Behavioral work is never committed directly to `main`; documentation-only changes may be.
- Branch naming families in use:
  - `migration/<component>` — component metadata migrations (see migration.md)
  - `machine/<name>` — features on the Machine host component or machine internals
  - `workflow/<name>` — app workflow features
  - `fix/<name>`, `upgrade/<name>`, `refactor/<name>` — as named
- A feature branch closes with its final `DOCUMENTATION:` commits, and the **merge commit** carries the closure title: `FEATURE: <name>` for features, `MIGRATION: <summary>` for migrations.
- Version commits are produced by `npm version` (message is the bare version, e.g. `0.14.0`) and pushed together with their tag: `git push origin main --follow-tags`.

# 2) Commit Anatomy

Every commit message is:

```
PREFIX: message [-> FAIL | -> PASS]
```

- `PREFIX` is an ALL-CAPS concern word followed by a colon.
- `message` is super-succinct and, for behavioral commits, **is the test sentence** (see Section 4).
- TDD pairs carry the `-> FAIL` / `-> PASS` suffix; both commits of a pair use the **identical message**, differing only in the suffix.

Canonical prefixes, in pipeline order where applicable:

| Prefix | Concern |
|---|---|
| `SPECIFICATIONS:` | Adding or changing a `*.specifications.json` file |
| `COMPOSITION:` | Template structure, cached element references |
| `STYLE:` | CSS — one commit **per rule/selector block** |
| `STATE:` | State vocabulary, value domains, state contracts, machine regions/transitions |
| `DATA:` | Data vocabulary, context, canonical data behavior |
| `VALIDATION:` | Validators in `*.validation.ts` |
| `OPERATION:` | Public operations |
| `EVENT:` | Event vocabulary, subscription properties, emission |
| `GESTURE:` | Gesture vocabulary and wiring |
| `TESTING:` | Test-only changes: coverage completion for existing behavior, test refactors, description alignment |
| `CONFIG:` | Tooling and runner configuration (karma, wallaby, importmaps, `.mcp.json`) |
| `PACKAGE:` | Dependencies, exports/imports surface, package metadata, file removal in favor of packages |
| `DOCUMENTATION:` | Docs: README, workflows.md, policy files, gate records, generated API docs |
| `AI:` | Agent instructions and context (`.claude/**`) |
| `FEATURE:` | Milestone: closes a coherent group of layer commits on the branch; also the merge-commit title |
| `MIGRATION:` | Merge-commit title for `migration/<component>` branches |

# 3) TDD Pairs and Granularity

**The granularity unit is one assertion, not one layer.** Each observable fact about the component gets its own FAIL/PASS pair. A layer therefore produces a *sequence* of small pairs, not one bundled pair.

The canonical per-construct sequence (from the pin history):

1. vocabulary constant exists — one pair per constant and per member:
   - `STATE: \`Visibility\` exists -> FAIL` / `-> PASS`
   - `STATE: \`Visibility.VISIBLE\` exists -> FAIL` / `-> PASS`
2. API member exists:
   - `STATE: \`pin.visibility\` getter exists -> FAIL` / `-> PASS`
   - `STATE: \`pin.visibility\` setter exists -> FAIL` / `-> PASS`
3. each behavior, one pair per assertion:
   - `STATE: \`pin.visibility\` getter returns \`Visibility.VISIBLE\` -> FAIL/PASS`
   - `STATE: set \`pin.visibility\` to \`Visibility.HIDDEN\` updates state -> FAIL/PASS`
   - `STATE: set \`pin.visibility\` to \`null\` updates state to \`Visibility.VISIBLE\` -> FAIL/PASS`
   - `STATE: set \`pin.visibility\` to \`Visibility.HIDDEN\` sets \`visibility\` attribute to \`Visibility.HIDDEN\` -> FAIL/PASS`
   - `STATE: set \`visibility\` attribute to \`Visibility.HIDDEN\` sets \`pin.visibility\` to \`Visibility.HIDDEN\` -> FAIL/PASS`

Operations follow the same trio: `\`Operation.PIN\` exists` → `\`pin.pin\` method exists` → `Invoke \`pin.pin\` sets \`pin.status\` to \`Status.PINNED\`` — each a pair.

Non-TDD layers are still atomic single commits: one `STYLE:` commit per CSS rule; one `CONFIG:` commit per configuration entry; one `PACKAGE:` commit per dependency concern.

# 4) The Message Is the Test Sentence

For behavioral commits, the message is the BDD description of the behavior being pinned — not a summary of the edit:

- identifiers appear in backticks exactly as they appear in code: `` `pin.status` ``, `` `Status.PINNED` ``, `` `Operation.TOGGLE` ``
- the sentence states the observable outcome: *what is true after the transition*, not *what was changed in which file*
- reading `git log --oneline` in reverse must reconstruct the component's contract assertion-by-assertion, without opening any file

Good: `EVENT: \`pin.onpin\` listener is called when \`pin.status\` changes from \`Status.UNPINNED\` to \`Status.PINNED\` -> PASS`

Bad: `EVENT: implement pin events` (bundled, no contract information, no identifiers)

# 5) Pipeline Ordering

Commits within a feature follow the implementation pipeline where the touched layers apply:

```
SPECIFICATIONS → COMPOSITION → STYLE → STATE → VALIDATION → OPERATION → EVENT → GESTURE → FEATURE
```

After the `FEATURE:` milestone: version commit (`npm version`), then trailing `PACKAGE:` / `DOCUMENTATION:` chores (API docs generation, README updates).

# 6) Policy Checklist

1. Branch per feature, named within an established family.
2. Every commit: `PREFIX: message`, one concern, one atomic change.
3. Every behavioral change: FAIL commit first, PASS commit second, identical message, `->` suffix.
4. One assertion per pair — vocabulary member, API member existence, and each behavior separately.
5. Message is the test sentence with backticked identifiers.
6. Non-TDD layers: one atomic change per commit (per CSS rule, per config entry).
7. Layer commits follow pipeline order.
8. `FEATURE:` milestone closes the group; merge commit carries the closure title.
9. Version via `npm version`; push with `--follow-tags`.
