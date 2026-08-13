import { Component, signal } from '@angular/core';
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

import {
  ALERT,
  alertVariantConfig,
  AVATAR,
  Badge,
  badgeVariantConfig,
  BREADCRUMB,
  Button,
  buttonVariantConfig,
  CARD,
  Input,
  Kbd,
  Label,
  Progress,
  Separator,
  Skeleton,
  TABLE,
  Textarea,
  XN_ACCORDION,
  XN_TABS,
} from '@xenode/ui';

type VariantName = keyof typeof buttonVariantConfig.variants.variant;
type SizeName = keyof typeof buttonVariantConfig.variants.size;
type BadgeVariantName = keyof typeof badgeVariantConfig.variants.variant;
type AlertVariantName = keyof typeof alertVariantConfig.variants.variant;

@Component({
  selector: 'app-components',
  imports: [
    Button,
    Badge,
    CARD,
    Label,
    Input,
    XN_TABS,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
    ALERT,
    BREADCRUMB,
    Kbd,
    Separator,
    Skeleton,
    TABLE,
    Textarea,
    AVATAR,
    Progress,
    XN_ACCORDION,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
  ],
  templateUrl: './components.html',
})
export class Components {
  // Derived from the library's own variants objects: the matrices below
  // cannot drift from what the components actually support.
  protected readonly variants = Object.keys(buttonVariantConfig.variants.variant) as VariantName[];
  protected readonly sizes = Object.keys(buttonVariantConfig.variants.size) as SizeName[];
  protected readonly badgeVariants = Object.keys(
    badgeVariantConfig.variants.variant,
  ) as BadgeVariantName[];

  protected readonly selectedTab = signal<string | undefined>('overview');

  protected readonly alertVariants = Object.keys(
    alertVariantConfig.variants.variant,
  ) as AlertVariantName[];
}
