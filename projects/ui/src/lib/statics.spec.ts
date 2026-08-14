import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AspectRatio } from './aspect-ratio/aspect-ratio';
import { ButtonGroup } from './button-group/button-group';
import { EMPTY } from './empty/empty';
import { FIELD } from './field/field';
import { INPUT_GROUP } from './input-group/input-group';
import { PAGINATION } from './pagination/pagination';
import { Prose } from './prose/prose';
import { Spinner } from './spinner/spinner';

/**
 * The Wave-6 statics share one contract (slot seam + base classes + consumer
 * class wins), so their specs live together; anything that grows behavior
 * graduates to its own spec file.
 */

@Component({
  imports: [Spinner, AspectRatio, Prose, EMPTY, ButtonGroup, INPUT_GROUP, FIELD, PAGINATION],
  template: `
    <span xnSpinner aria-label="Loading" class="size-6"></span>

    <div xnAspectRatio ratio="1 / 1"><img src="x.png" alt="" /></div>

    <article xnProse>
      <h2>Title</h2>
      <p>Body</p>
    </article>

    <div xnEmpty>
      <p xnEmptyTitle>No servers yet</p>
      <p xnEmptyDescription>Create one to get started.</p>
    </div>

    <div xnButtonGroup aria-label="Pagination style">
      <button type="button">A</button>
      <button type="button">B</button>
    </div>

    <div xnInputGroup>
      <span xnInputAddon>https://</span>
      <input aria-label="Domain" />
    </div>

    <div xnField>
      <label for="f1">Name</label>
      <input id="f1" aria-describedby="f1-err" aria-invalid="true" />
      <p xnFieldError id="f1-err">Required.</p>
    </div>

    <nav xnPagination>
      <ul xnPaginationList>
        <li><a xnPaginationLink href="/p/1" aria-current="page">1</a></li>
        <li><a xnPaginationLink href="/p/2">2</a></li>
      </ul>
    </nav>
  `,
})
class Host {}

describe('Wave-6 statics', () => {
  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders every slot with its base classes, consumer class winning', async () => {
    const el = await render();

    const spinner = el.querySelector('[data-slot="spinner"]');
    expect(spinner?.getAttribute('role')).toBe('status');
    expect(spinner?.classList).toContain('size-6');
    expect(spinner?.classList).not.toContain('size-4');

    expect(el.querySelector<HTMLElement>('[data-slot="aspect-ratio"]')?.style.aspectRatio).toBe(
      '1 / 1',
    );

    // Prose rhythm derives from three custom properties (the typeset model).
    expect(el.querySelector('[data-slot="prose"]')?.classList).toContain(
      '[&_h2]:text-[calc(var(--prose-size)*1.5)]',
    );
    expect(el.querySelector('[data-slot="prose"]')?.classList).toContain('[--prose-flow:1.25em]');
    expect(el.querySelector('[data-slot="empty-description"]')?.classList).toContain(
      'text-muted-foreground',
    );
    expect(el.querySelector('[data-slot="button-group"]')?.getAttribute('role')).toBe('group');
    expect(el.querySelector('[data-slot="input-addon"]')?.classList).toContain('bg-muted');
    expect(el.querySelector('[data-slot="field-error"]')?.classList).toContain('text-danger');
  });

  it('pagination is a landmark whose current page is styled from aria-current', async () => {
    const el = await render();
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('pagination');
    const links = el.querySelectorAll('[data-slot="pagination-link"]');
    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links[0].classList).toContain('aria-[current=page]:border');
  });
});
