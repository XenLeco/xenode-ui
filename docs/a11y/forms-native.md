# Manual accessibility notes — native form controls

Checkbox, radio group, switch, slider, native select, toggle, collapsible.
All keep the platform's semantics; automation covers roles, labels,
grouping and state reflection.

Design decision: checkbox/radio keep native appearance colored via
accent-color tokens — full native rendering, dark-aware through
color-scheme. The switch is appearance-none by necessity (no native switch
exists) but stays a real checkbox with role="switch".

Hand checks:

- [ ] Space toggles checkbox/switch/toggle; arrows move radio selection and
      slide the slider (real keys)
- [ ] Narrator: switch announces on/off (not checked/unchecked), toggle
      announces pressed state, radio announces position in group
- [ ] Collapsible summary toggles with Enter/Space and announces
      expanded/collapsed
- [ ] Slider announces its value as it changes

## Runs

| Date       | Mode(s)      | Result           | Notes                                                                                                                                    |
| ---------- | ------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-13 | light + dark | pass (automated) | Native semantics unit-tested (radio exclusivity, switch role, toggle model, checkbox check); keyboard + Narrator pending the hand sweep. |
