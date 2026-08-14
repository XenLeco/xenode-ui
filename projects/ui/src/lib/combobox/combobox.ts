import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

/**
 * Trigger styling for the select-style (non-editable) combobox — aria's
 * "custom select" case: `<div ngCombobox xnSelectTrigger>`. A child marked
 * data-chevron rotates while expanded; state reads aria-expanded.
 */
@Directive({
  selector: '[xnSelectTrigger]',
  host: {
    'data-slot': 'select-trigger',
    '[class]': 'classes()',
  },
})
export class SelectTrigger {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-[color,border-color] select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&>[data-chevron]]:transition-transform [&[aria-expanded=true]>[data-chevron]]:rotate-180',
      this.userClass(),
    ),
  );
}

/**
 * Styling for the @angular/aria combobox popup — composed beside
 * ngCombobox/ngComboboxPopup/ngComboboxWidget/ngListbox/ngOption in the
 * consumer's template (zero aria imports here, same contract as tabs,
 * accordion and dropdown):
 *
 * ```html
 * <div xnDropdown class="w-64">
 *   <input xnInput ngCombobox #cb="ngCombobox" [(value)]="query" … />
 *   <ng-template ngComboboxPopup [combobox]="cb">
 *     <div xnComboboxPanel ngComboboxWidget ngListbox #lb="ngListbox" …>
 *       <div xnListboxOption ngOption [value]="…">…</div>
 *     </div>
 *   </ng-template>
 * </div>
 * ```
 *
 * The trigger styles with xnInput, options with xnListboxOption, the
 * wrapper with xnDropdown — this panel is the only new seam.
 */
@Directive({
  selector: '[xnComboboxPanel]',
  host: { 'data-slot': 'combobox-panel', '[class]': 'classes()' },
})
export class ComboboxPanel {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'absolute top-full left-0 z-50 mt-1 flex max-h-64 w-full flex-col gap-0.5 overflow-y-auto rounded-md border bg-background p-1 text-foreground shadow-md transition-[opacity,translate,display] transition-discrete duration-150 [scrollbar-width:thin] starting:-translate-y-1 starting:opacity-0 [&[inert]]:hidden',
      this.userClass(),
    ),
  );
}
