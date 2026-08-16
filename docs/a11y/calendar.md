# Calendar — manual keyboard checklist

The harness cannot synthesize trusted key identity, so the grid's keyboard
contract needs a hand check. Automated coverage already proves: roving
tabindex (exactly one tabbable cell), grid/row/gridcell roles, full-date
aria-labels, aria-selected on click-commit, aria-disabled under min/max
and on outside days.

On `/components/forms` → Calendar:

- [ ] Tab reaches the grid once (one stop), landing on the selected or
      first available day; Tab again leaves the grid.
- [ ] Arrow Right/Left walk days and continue across week boundaries
      (rowWrap continuous); Arrow Up/Down walk weeks and stop at the
      month's first/last week (colWrap nowrap).
- [ ] Home/End jump to the start/end of the current week row.
- [ ] Space or Enter selects the focused day; the value line updates;
      aria-selected moves.
- [ ] Disabled days (before the min, outside days) are focusable but
      Space/Enter does nothing (softDisabled).
- [ ] Prev/next month buttons are Tab stops with visible focus rings and
      react to Enter/Space.
- [ ] Narrator/NVDA: day announcement reads the full date ("Friday,
      August 14, 2026"), selection state, and disabled state; the month
      label change is announced (aria-live polite).
- [ ] Date picker: trigger opens the popover; Escape closes it and
      returns focus to the trigger; the overlay calendar's grid behaves
      as above.

Notes: PageUp/PageDown month paging is deliberately not implemented (not
in the grid primitive's vocabulary; we do not hand-roll keys — rule 1).
