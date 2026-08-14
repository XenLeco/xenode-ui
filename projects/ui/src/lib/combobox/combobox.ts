import { Directive, computed, input } from '@angular/core';

import { cn } from '../cn';

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
