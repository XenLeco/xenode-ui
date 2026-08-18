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

Design intents to hold (documented divergences included):

- The palette opens QUIET — a bare input; the list appears on typing or
  ArrowDown. Deliberate: `alwaysExpanded` would make the combobox consume
  Escape forever and kill Escape-to-close on the dialog.
- The mobile "Search…" pill lives INSIDE the docs nav landmark purely so
  it joins the scrollable pill row; the desktop trigger sits outside.
  Landmark purity traded for layout — a documented divergence.
- The kbd hint renders "Ctrl K" at prerender and flips to "⌘K" on Apple
  platforms after hydration; Ctrl+K is deliberately NOT bound on macOS
  (it is kill-line in every text field there).

On `/components` (any docs page):

- [ ] Ctrl+K opens the palette (on a Mac layout: ⌘K opens, Ctrl+K in a
      text field still kills-to-end); the browser's own address-bar
      focus does NOT trigger.
- [ ] Ctrl/⌘K while the palette is open CLOSES it (toggle) — it must not
      silently wipe the typed query.
- [ ] The input has focus immediately on open; typing filters at once;
      the result count is announced (role=status "N results"), and a
      no-hit query announces "No matches".
- [ ] ArrowDown walks the results; the active row is visibly highlighted
      AND Narrator/NVDA announces each option ("Buttons Split button" —
      the › separator is aria-hidden and must NOT be voiced),
      proving aria-activedescendant is live.
- [ ] Enter on an active option closes the palette and lands on the right
      page, scrolled toward the section (page may be too short to pin the
      heading to the top — it must be on screen).
- [ ] Selecting the entry for the section you are ALREADY on still
      scrolls to it (the same-URL navigation is skipped by the router;
      the palette scrolls by hand).
- [ ] Escape once while the result list is open closes only the LIST
      (aria-expanded flips false); the dialog stays. This must hold with
      focus ON THE INPUT and also after Tab moved focus INTO the list.
- [ ] Escape again closes the dialog; focus returns to the button that
      opened it (Search field or the mobile pill), with a visible ring.
- [ ] The ✕ button closes by mouse AND by touch; clicking the backdrop
      closes where `closedby="any"` is supported (progressive — the ✕ is
      the guaranteed exit).
- [ ] Reopen after selecting by TAP (mobile path): the palette presents
      the same fresh state as the keyboard path — no result list already
      open, no stale row announced.
- [ ] Narrow viewport (<640px): the pill row's "Search…" pill opens the
      same palette; on-screen keyboard typing filters; the ✕ closes
      (there is no Escape on a touch keyboard — this is the exit).
- [ ] Tab inside the open dialog stays within it (native showModal trap);
      Shift+Tab from the input does not escape to the page.
