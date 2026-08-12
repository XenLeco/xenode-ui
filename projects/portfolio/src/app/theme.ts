import { DOCUMENT, PLATFORM_ID, Service, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

/**
 * Owns the three-state theme preference. The inline script in index.html
 * applies the initial `.dark` class before first paint; this service takes
 * over from there. No stored key means dark — the brand default.
 */
@Service()
export class Theme {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly systemPrefersDark = signal(false);

  readonly preference = signal<ThemePreference>('dark');

  constructor() {
    // During prerendering there is no localStorage, matchMedia or persistent
    // DOM; the generated HTML must stay theme-neutral so the inline script
    // decides at load time.
    if (!this.isBrowser) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      this.preference.set(stored);
    }

    const media = matchMedia('(prefers-color-scheme: dark)');
    this.systemPrefersDark.set(media.matches);
    media.addEventListener('change', (event) => this.systemPrefersDark.set(event.matches));

    // effect, not computed/linkedSignal: this bridges reactive state to a
    // non-reactive sink — the <html> class list, which CSS reads and Angular
    // does not own.
    effect(() => {
      const preference = this.preference();
      const dark =
        preference === 'light' ? false : preference === 'dark' ? true : this.systemPrefersDark();
      this.document.documentElement.classList.toggle('dark', dark);
    });
  }

  setPreference(preference: ThemePreference): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, preference);
    }
    this.preference.set(preference);
  }
}
