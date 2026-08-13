# Manual accessibility notes — Wave 1 static families

Separator, skeleton, kbd, alert, textarea, table, breadcrumb. All
non-interactive or natively-semantic; the automated suite covers the
contracts (roles, aria-current, aria-hidden separators, th scoping,
label association). Hand checks that remain:

- [ ] **Alert**: role="alert" announces on appearance — verify with Narrator
      that a dynamically shown alert is read; do not use it for static
      decoration
- [ ] **Skeleton**: purely decorative; confirm screen readers skip it
      (no text content, no role)
- [ ] **Table**: spot-check header/cell association reads correctly in
      Narrator on the showcase table
- [ ] **Textarea**: keyboard walk covered with input's checklist
- [ ] **Breadcrumb**: Narrator announces "breadcrumb navigation" landmark
      and "current page" on the last item

## Runs

| Date | Mode(s) | Result | Notes |
| ---- | ------- | ------ | ----- |
| 2026-08-13 | light + dark | pass (automated) | Contracts unit-tested + axe; Narrator items pending hand check. |
