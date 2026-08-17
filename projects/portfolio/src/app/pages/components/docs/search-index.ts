export interface SearchEntry {
  /** Route segment under /components ('' is the overview page). */
  readonly page: string;
  readonly pageLabel: string;
  /** Rendered heading text; equals pageLabel for page-level entries. */
  readonly label: string;
  /** h2 id on that page; '' jumps to the page top. */
  readonly anchor: string;
}

/** Stable option value for a listbox row — page and anchor, one string. */
export const searchKey = (entry: SearchEntry): string => `${entry.page}#${entry.anchor}`;

const page = (
  path: string,
  label: string,
  sections: readonly (readonly [anchor: string, label: string])[],
): readonly SearchEntry[] => [
  { page: path, pageLabel: label, label, anchor: '' },
  ...sections.map(([anchor, section]) => ({
    page: path,
    pageLabel: label,
    label: section,
    anchor,
  })),
];

/**
 * Everything the ⌘K palette can jump to. Hand-maintained, but it cannot
 * drift silently: the spec renders every docs page and asserts each entry
 * resolves to that page's own rendered h2 — id, text and visibility.
 */
export const SEARCH_INDEX: readonly SearchEntry[] = [
  ...page('', 'Overview', []),
  ...page('buttons', 'Buttons', [
    ['button-heading', 'Button'],
    ['group-heading', 'Button group'],
    ['split-heading', 'Split button'],
    ['toggle-heading', 'Toggle'],
  ]),
  ...page('forms', 'Forms', [
    ['calendar-h', 'Calendar'],
    ['number-h', 'Number input'],
    ['color-h', 'Color input'],
    ['field-example-h', 'Field example'],
  ]),
  ...page('display', 'Display', [
    ['badge-h', 'Badge, tag & kbd'],
    ['avatar-h', 'Avatar, rating & progress'],
    ['stat-h', 'Stats'],
    ['item-h', 'Item & empty state'],
    ['timeline-h', 'Timeline & stepper'],
    ['dl-h', 'Description list'],
    ['image-h', 'Image'],
    ['chip-h', 'Chip'],
  ]),
  ...page('feedback', 'Feedback', [
    ['alert-h', 'Alert'],
    ['callout-h', 'Callout & banner'],
    ['loading-h', 'Loading states'],
    ['toast-h', 'Toast'],
    ['radial-progress-h', 'Radial progress (semicircle)'],
  ]),
  ...page('navigation', 'Navigation', [
    ['tabs-h', 'Tabs'],
    ['crumb-h', 'Breadcrumb & pagination'],
    ['navmenu-h', 'Nav menu'],
    ['navpanels-h', 'Navigation menu with panels'],
    ['sidebar-h', 'Sidebar'],
  ]),
  ...page('overlays', 'Overlays', [
    ['dropdown-example-h', 'Dropdown menu example'],
    ['tooltip-h', 'Tooltip'],
  ]),
  ...page('disclosure', 'Disclosure & data', [
    ['acc-h', 'Accordion'],
    ['coll-h', 'Collapsible'],
    ['resize-h', 'Resizable & scroll area'],
    ['car-h', 'Carousel'],
    ['table-h', 'Table with sortable header'],
    ['dt-h', 'Data table'],
  ]),
  ...page('typography', 'Typography', [
    ['prose-h', 'Prose'],
    ['code-h', 'Code & figure'],
    ['shell-h', 'Hero, section header & footer'],
    ['highlight-h', 'Highlight'],
  ]),
  ...page('chat', 'Chat', [
    ['chat-h', 'Conversation'],
    ['example-h', 'Message example'],
    ['stream-h', 'Streaming'],
    ['q-h', 'Questionnaire'],
  ]),
  ...page('blocks', 'Blocks', [
    ['login-h', 'Login'],
    ['bento-h', 'Bento'],
    ['pricing-h', 'Pricing'],
    ['faq-h', 'FAQ'],
  ]),
  ...page('charts', 'Charts', [
    ['bar-h', 'Bar'],
    ['line-h', 'Line'],
    ['pie-h', 'Pie'],
  ]),
  ...page('motion', 'Motion', [['rolling-number-h', 'Rolling number']]),
  ...page('layout', 'Layout', [
    ['scaffold-h', 'Page scaffold'],
    ['join-h', 'Join'],
    ['dock-h', 'Dock & phone mockup'],
    ['burger-h', 'Burger'],
    ['affix-h', 'Affix'],
    ['speed-dial-h', 'Speed dial'],
  ]),
];
