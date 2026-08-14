import { Routes } from '@angular/router';

/** One lazy page per component category, rendered inside the docs shell. */
export const DOCS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./docs/overview').then((m) => m.Overview),
    title: 'Components — Dan Leco',
  },
  {
    path: 'buttons',
    loadComponent: () => import('./docs/buttons').then((m) => m.ButtonsDoc),
    title: 'Buttons — Dan Leco',
  },
  {
    path: 'forms',
    loadComponent: () => import('./docs/forms').then((m) => m.FormsDoc),
    title: 'Forms — Dan Leco',
  },
  {
    path: 'display',
    loadComponent: () => import('./docs/display').then((m) => m.DisplayDoc),
    title: 'Display — Dan Leco',
  },
  {
    path: 'feedback',
    loadComponent: () => import('./docs/feedback').then((m) => m.FeedbackDoc),
    title: 'Feedback — Dan Leco',
  },
  {
    path: 'navigation',
    loadComponent: () => import('./docs/navigation').then((m) => m.NavigationDoc),
    title: 'Navigation — Dan Leco',
  },
  {
    path: 'overlays',
    loadComponent: () => import('./docs/overlays').then((m) => m.OverlaysDoc),
    title: 'Overlays — Dan Leco',
  },
  {
    path: 'disclosure',
    loadComponent: () => import('./docs/disclosure').then((m) => m.DisclosureDoc),
    title: 'Disclosure & data — Dan Leco',
  },
  {
    path: 'typography',
    loadComponent: () => import('./docs/typography').then((m) => m.TypographyDoc),
    title: 'Typography — Dan Leco',
  },
  {
    path: 'chat',
    loadComponent: () => import('./docs/chat').then((m) => m.ChatDoc),
    title: 'Chat — Dan Leco',
  },
  {
    path: 'blocks',
    loadComponent: () => import('./docs/blocks').then((m) => m.BlocksDoc),
    title: 'Blocks — Dan Leco',
  },
  {
    path: 'motion',
    loadComponent: () => import('./docs/motion').then((m) => m.MotionDoc),
    title: 'Motion — Dan Leco',
  },
];
