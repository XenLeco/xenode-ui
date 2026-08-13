import { Routes } from '@angular/router';

/**
 * All pages are lazy (loadComponent): each becomes its own chunk fetched on
 * navigation, so the initial bundle carries only the shell. The showcase in
 * particular imports every library component and must not weigh down first
 * paint. Prerendering still emits static HTML per route.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Dan Leco — developer',
  },
  {
    path: 'components',
    loadComponent: () => import('./pages/components/components').then((m) => m.Components),
    title: 'Components — Dan Leco',
  },
  // Explicit so the prerenderer emits a real 404 page for the CDN to serve;
  // the wildcard below only covers client-side navigation.
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Page not found — Dan Leco',
  },
  { path: '**', redirectTo: '404' },
];
