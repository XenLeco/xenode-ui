import { Component, inject } from '@angular/core';

import { Theme, ThemePreference } from '../theme';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  protected readonly theme = inject(Theme);
  protected readonly options: readonly ThemePreference[] = ['light', 'dark', 'system'];
}
