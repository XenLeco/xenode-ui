import { Component, computed, signal } from '@angular/core';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';

import {
  Checkbox,
  ComboboxPanel,
  Dropdown,
  SelectTrigger,
  FIELD,
  Input,
  INPUT_GROUP,
  INPUT_OTP,
  Label,
  NativeSelect,
  RADIO_GROUP,
  Slider,
  Switch,
  Textarea,
  XnListboxOption,
} from '@xenode/ui';

@Component({
  selector: 'app-docs-forms',
  imports: [
    Label,
    Input,
    Textarea,
    FIELD,
    INPUT_GROUP,
    Checkbox,
    RADIO_GROUP,
    Switch,
    Slider,
    NativeSelect,
    INPUT_OTP,
    Combobox,
    ComboboxPopup,
    ComboboxWidget,
    Listbox,
    Option,
    ComboboxPanel,
    Dropdown,
    SelectTrigger,
    XnListboxOption,
  ],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Forms</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      Native controls styled through tokens — semantics, keyboard and form participation stay the
      platform's. Error state pairs aria-invalid with described-by text; color is the redundant
      channel.
    </p>

    <div class="mt-8 grid max-w-sm gap-6">
      <div xnField>
        <label xnLabel for="f-name">Display name</label>
        <input xnInput id="f-name" type="text" placeholder="Dan" />
        <p xnFieldDescription>Shown on your public profile.</p>
      </div>

      <div xnField>
        <label xnLabel for="f-email">Email</label>
        <input
          xnInput
          id="f-email"
          type="email"
          aria-invalid="true"
          aria-describedby="f-email-error"
          value="not-an-email"
        />
        <p xnFieldError id="f-email-error">Enter a valid email address.</p>
      </div>

      <div xnField>
        <label xnLabel for="f-domain">Domain</label>
        <div xnInputGroup>
          <span xnInputAddon>https://</span>
          <input xnInput id="f-domain" class="rounded-l-none" value="danleco.dev" />
        </div>
      </div>

      <div xnField>
        <label xnLabel for="f-bio">Bio</label>
        <textarea xnTextarea id="f-bio" placeholder="A sentence or two…"></textarea>
      </div>

      <div class="flex items-center gap-2">
        <input xnCheckbox type="checkbox" id="f-terms" checked />
        <label xnLabel for="f-terms">Accept the license</label>
      </div>

      <fieldset xnRadioGroup>
        <legend class="mb-2 text-sm font-medium">Deployment target</legend>
        <div class="flex items-center gap-2">
          <input xnRadio type="radio" name="f-target" id="f-pi" checked />
          <label xnLabel for="f-pi">Raspberry Pi</label>
        </div>
        <div class="flex items-center gap-2">
          <input xnRadio type="radio" name="f-target" id="f-vps" />
          <label xnLabel for="f-vps">VPS</label>
        </div>
      </fieldset>

      <div class="flex items-center gap-2">
        <input xnSwitch type="checkbox" id="f-notify" />
        <label xnLabel for="f-notify">Email notifications</label>
      </div>

      <div xnField>
        <label xnLabel for="f-volume">Volume</label>
        <input xnSlider type="range" id="f-volume" min="0" max="100" value="40" />
      </div>

      <div xnField>
        <label xnLabel for="f-game">Game</label>
        <select xnNativeSelect id="f-game">
          <option>Minecraft</option>
          <option>Project Zomboid</option>
        </select>
      </div>

      <div xnField>
        <label xnLabel for="f-game-search">Game (combobox)</label>
        <div xnDropdown class="block w-full">
          <input
            xnInput
            id="f-game-search"
            ngCombobox
            #cb="ngCombobox"
            [(value)]="comboboxQuery"
            placeholder="Type to filter…"
            aria-label="Search games"
          />
          <ng-template ngComboboxPopup [combobox]="cb">
            <div
              xnComboboxPanel
              ngComboboxWidget
              ngListbox
              #lb="ngListbox"
              [(value)]="comboboxSelection"
              [activeDescendant]="lb.activeDescendant()"
              aria-label="Games"
            >
              @for (game of filteredGames(); track game) {
                <div xnListboxOption ngOption [value]="game">{{ game }}</div>
              } @empty {
                <div class="px-2 py-1.5 text-sm text-muted-foreground">No matches.</div>
              }
            </div>
          </ng-template>
        </div>
        <p xnFieldDescription>
          Behavior from &#64;angular/aria — arrow keys, typeahead and aria wiring; filtering is app
          logic. Selected: {{ comboboxSelection().join(', ') || 'none' }}
        </p>
      </div>

      <div xnField>
        <span class="text-sm font-medium" id="f-region-label">Region (custom select)</span>
        <div xnDropdown class="block w-full">
          <div ngCombobox #sel="ngCombobox" xnSelectTrigger aria-labelledby="f-region-label">
            {{ selectedRegion()[0] ?? 'Pick a region…' }}
            <span data-chevron aria-hidden="true">⌄</span>
          </div>
          <ng-template ngComboboxPopup [combobox]="sel">
            <div
              xnComboboxPanel
              ngComboboxWidget
              ngListbox
              #rlb="ngListbox"
              [(value)]="selectedRegion"
              [activeDescendant]="rlb.activeDescendant()"
              aria-labelledby="f-region-label"
            >
              @for (region of regions; track region) {
                <div xnListboxOption ngOption [value]="region">{{ region }}</div>
              }
            </div>
          </ng-template>
        </div>
        <p xnFieldDescription>The non-editable combobox — aria's custom-select pattern.</p>
      </div>

      <div xnField>
        <span class="text-sm font-medium">Verification code</span>
        <div xnOtpGroup aria-label="Verification code">
          <input xnOtpSlot aria-label="Digit 1" />
          <input xnOtpSlot aria-label="Digit 2" />
          <input xnOtpSlot aria-label="Digit 3" />
          <input xnOtpSlot aria-label="Digit 4" />
          <input xnOtpSlot aria-label="Digit 5" />
          <input xnOtpSlot aria-label="Digit 6" />
        </div>
        <p xnFieldDescription>Typing advances; pasting a code fills every slot.</p>
      </div>
    </div>
  `,
})
export class FormsDoc {
  private readonly games = ['Minecraft', 'Project Zomboid', 'Valheim', 'Palworld', 'Terraria'];

  protected readonly comboboxQuery = signal('');
  protected readonly comboboxSelection = signal<string[]>([]);

  protected readonly regions = ['eu-west', 'us-east', 'ap-south'];
  protected readonly selectedRegion = signal<string[]>([]);
  protected readonly filteredGames = computed(() => {
    const query = this.comboboxQuery().trim().toLowerCase();
    return query ? this.games.filter((g) => g.toLowerCase().includes(query)) : this.games;
  });
}
