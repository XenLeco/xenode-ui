import { Directive, ElementRef, OnDestroy, OnInit, inject, signal } from '@angular/core';

/**
 * Tracks which [id]-carrying child section is in view and exposes it as
 * `activeId` — the consumer binds it to nav styling:
 *
 * ```html
 * <main xnScrollspy #spy="xnScrollspy">
 *   <section id="a">…</section>
 * </main>
 * <a href="#a" [attr.aria-current]="spy.activeId() === 'a' ? 'true' : null">A</a>
 * ```
 *
 * No-ops where IntersectionObserver is unavailable (prerender, jsdom).
 */
@Directive({
  selector: '[xnScrollspy]',
  exportAs: 'xnScrollspy',
  host: { 'data-slot': 'scrollspy' },
})
export class Scrollspy implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  readonly activeId = signal<string | null>(null);

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeId.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    for (const section of this.elementRef.nativeElement.querySelectorAll('[id]')) {
      this.observer.observe(section);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
