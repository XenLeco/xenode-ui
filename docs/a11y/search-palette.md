# Docs search palette (⌘K) — manual keyboard checklist

The harness cannot synthesize trusted key identity — a script-dispatched
Escape does not run the platform's dialog-cancel action, and a
script-opened dialog restores focus to wherever focus was (BODY), so the
close/restore path below is only provable by hand. Automated coverage
already proves (docs.spec.ts + search-index.spec.ts): the triggers and
dialog render, filtering narrows the index, selection navigates with the
right route + fragment, unknown keys never navigate, every index anchor is
a real rendered h2 on its page, and — via the FormsDoc combobox spec —
arrowing sets aria-activedescendant (focusMode="activedescendant" is
load-bearing; the roving default leaves it permanently null).

On `/components` (any docs page):

- [ ] Ctrl+K (and ⌘K on a Mac layout if available) opens the palette;
      the browser's own address-bar focus does NOT trigger.
- [ ] The input has focus immediately on open; typing filters at once.
- [ ] ArrowDown walks the results; the active row is visibly highlighted
      AND Narrator/NVDA announces each option ("Buttons › Split button"),
      proving aria-activedescendant is live.
- [ ] Enter on an active option closes the palette and lands on the right
      page, scrolled toward the section (page may be too short to pin the
      heading to the top — it must be on screen).
- [ ] Escape once while the result list is open closes only the LIST
      (aria-expanded flips false); the dialog stays.
- [ ] Escape again closes the dialog; focus returns to the button that
      opened it (Search field or the mobile pill), with a visible ring.
- [ ] Open via the sm+ "Search docs…" button by mouse, close with
      Escape: focus restores to that button.
- [ ] Narrow viewport (<640px): the pill row's "Search…" pill opens the
      same palette; on-screen keyboard typing filters.
- [ ] Tab inside the open dialog stays within it (native showModal trap);
      Shift+Tab from the input does not escape to the page.
