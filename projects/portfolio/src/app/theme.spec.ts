import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Theme } from './theme';

describe('Theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
  });

  async function stable(): Promise<void> {
    await TestBed.inject(ApplicationRef).whenStable();
  }

  it('defaults to dark when nothing is stored', async () => {
    const service = TestBed.inject(Theme);
    await stable();
    expect(service.preference()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('honors a stored light preference', async () => {
    localStorage.setItem('theme', 'light');
    const service = TestBed.inject(Theme);
    await stable();
    expect(service.preference()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies and persists a new preference', async () => {
    const service = TestBed.inject(Theme);
    await stable();

    service.setPreference('light');
    await stable();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');

    service.setPreference('dark');
    await stable();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('ignores garbage in storage and falls back to dark', async () => {
    localStorage.setItem('theme', 'banana');
    const service = TestBed.inject(Theme);
    await stable();
    expect(service.preference()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
