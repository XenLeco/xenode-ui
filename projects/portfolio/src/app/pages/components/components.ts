import { Component, inject, signal } from '@angular/core';
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

import {
  ALERT,
  alertVariantConfig,
  AVATAR,
  Badge,
  badgeVariantConfig,
  BREADCRUMB,
  Button,
  ButtonGroup,
  buttonVariantConfig,
  CARD,
  Checkbox,
  COLLAPSIBLE,
  DIALOG,
  DIALOG_DERIVATIVES,
  EMPTY,
  FIELD,
  Input,
  INPUT_GROUP,
  Kbd,
  Label,
  NativeSelect,
  PAGINATION,
  Progress,
  Prose,
  RADIO_GROUP,
  ScrollArea,
  Separator,
  Skeleton,
  Spinner,
  Slider,
  Switch,
  TABLE,
  Textarea,
  ToastService,
  Toggle,
  ToggleGroup,
  Tooltip,
  CAROUSEL,
  XN_ACCORDION,
  XN_DROPDOWN,
  XN_HOVER_CARD,
  XN_POPOVER,
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
    DIALOG,
    Tooltip,
    Checkbox,
    RADIO_GROUP,
    Switch,
    Slider,
    NativeSelect,
    Toggle,
    ToggleGroup,
    COLLAPSIBLE,
    Spinner,
    Prose,
    EMPTY,
    ButtonGroup,
    INPUT_GROUP,
    FIELD,
    PAGINATION,
    DIALOG_DERIVATIVES,
    ScrollArea,
    XN_DROPDOWN,
    Menu,
    MenuItem,
    MenuTrigger,
    MenuContent,
    XN_POPOVER,
    XN_HOVER_CARD,
    CAROUSEL,
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

  private readonly toastService = inject(ToastService);

  protected showToast(): void {
    this.toastService.show('Changes saved to the library.', { title: 'Saved' });
  }

  protected showDestructiveToast(): void {
    this.toastService.show('The deploy step exited non-zero.', {
      title: 'Deploy failed',
      variant: 'destructive',
    });
  }

  protected onMenuSelect(action: string): void {
    this.toastService.show(`Menu action: ${action}`, { title: 'Selected' });
  }
}
