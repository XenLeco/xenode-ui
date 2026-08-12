import { Routes } from '@angular/router';

import { Components } from './pages/components/components';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home, title: 'Dan Leco — developer' },
  { path: 'components', component: Components, title: 'Components — Dan Leco' },
  // Explicit so the prerenderer emits a real 404 page for the CDN to serve;
  // the wildcard below only covers client-side navigation.
  { path: '404', component: NotFound, title: 'Page not found — Dan Leco' },
  { path: '**', redirectTo: '404' },
];
