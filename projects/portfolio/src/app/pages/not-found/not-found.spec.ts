import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { NotFound } from './not-found';

describe('NotFound', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the 404 heading and a way home', async () => {
    const fixture = TestBed.createComponent(NotFound);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('404');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe('/');
  });
});
