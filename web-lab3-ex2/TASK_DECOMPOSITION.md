# Lab 3 - Exercise 2: Pioneer Directory (Task Decomposition)

## Block 1: Data Normalization (Commit 1)
- [x] Define `Scientist` interface with stable IDs.
- [x] Create `ScientistDirectory` component.
- [x] Render raw list using semantic `<ul>` and `<li>`.

## Block 2: Interactive Derived State (Commit 2)
- [x] Implement Case-insensitive search by name.
- [x] Implement Min-IQ numeric filter (`valueAsNumber`).
- [x] Implement Sort by IQ/Age using `.toSorted()`.
- [x] Ensure ZERO `useEffect` used for filtering/sorting.

## Block 3: Mutations & A11y (Commit 3)
- [x] Implement Immutable Delete by ID.
- [x] Implement Reset Data logic.
- [x] Add Live Counter via `<output role="status" aria-live="polite">`.
- [x] Verify all inputs bound via `<label htmlFor>` + `useId()`.