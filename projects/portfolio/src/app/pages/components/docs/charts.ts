import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ChartCard } from '@xenode/ui';

import { ExampleBox } from './example-box';

const PLAYERS = [
  { name: 'skyblock-prod', value: 42 },
  { name: 'minigames-hub', value: 58 },
  { name: 'modded-create', value: 21 },
  { name: 'zomboid-main', value: 12 },
  { name: 'vanilla-smp', value: 9 },
];

const LATENCY = [
  {
    name: 'p95',
    series: [
      { name: '00:00', value: 38 },
      { name: '04:00', value: 31 },
      { name: '08:00', value: 47 },
      { name: '12:00', value: 64 },
      { name: '16:00', value: 71 },
      { name: '20:00', value: 52 },
    ],
  },
  {
    name: 'p50',
    series: [
      { name: '00:00', value: 21 },
      { name: '04:00', value: 18 },
      { name: '08:00', value: 24 },
      { name: '12:00', value: 33 },
      { name: '16:00', value: 36 },
      { name: '20:00', value: 27 },
    ],
  },
];

const REGIONS = [
  { name: 'eu-west', value: 5 },
  { name: 'us-east', value: 3 },
  { name: 'eu-north', value: 2 },
  { name: 'us-west', value: 2 },
];

@Component({
  selector: 'app-docs-charts',
  imports: [NgxChartsModule, ChartCard, ExampleBox],
  template: `
    <h1 class="text-2xl font-semibold tracking-tight">Charts</h1>
    <p class="mt-2 max-w-prose text-muted-foreground">
      A composition: ngx-charts renders, the library provides the frame and the palette.
      <code class="font-mono text-xs">xnChartCard</code> resolves
      <code class="font-mono text-xs">--chart-1..5</code> to concrete colors at runtime (chart
      engines cannot parse oklch), re-resolves on theme flips, and tokens the axis text and
      gridlines through CSS. Charts render client-side only: prerender ships placeholders via
      <code class="font-mono text-xs">&#64;defer</code> (the engine still travels in the route chunk
      — module components cannot code-split), and
      <code class="font-mono text-xs">[animations]</code> binds the card's reduced-motion signal —
      the CSS motion collapse cannot reach Web Animations or d3 transitions.
    </p>

    <section class="mt-8" aria-labelledby="bar-h">
      <h2 id="bar-h" class="text-lg font-semibold">Bar</h2>
      <div xnChartCard #bar="xnChartCard" aria-label="Players per server" class="mt-3 h-72">
        <!-- The chart engine measures its PARENT's border-box; this
             wrapper makes that the card's content box, so axis labels
             fit instead of being clipped by the frame. -->
        <div class="h-full w-full">
          @defer (on viewport) {
            <ngx-charts-bar-vertical
              [scheme]="$any(bar.scheme())"
              [results]="players"
              [xAxis]="true"
              [yAxis]="true"
              [animations]="bar.animations()"
            />
          } @placeholder {
            <div class="h-full w-full animate-pulse rounded-md bg-muted"></div>
          }
        </div>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="line-h">
      <h2 id="line-h" class="text-lg font-semibold">Line</h2>
      <div
        xnChartCard
        #line="xnChartCard"
        aria-label="Latency percentiles over the day"
        class="mt-3 h-72"
      >
        <div class="h-full w-full">
          @defer (on viewport) {
            <ngx-charts-line-chart
              [scheme]="$any(line.scheme())"
              [results]="latency"
              [xAxis]="true"
              [yAxis]="true"
              [legend]="true"
              [animations]="line.animations()"
            />
          } @placeholder {
            <div class="h-full w-full animate-pulse rounded-md bg-muted"></div>
          }
        </div>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="pie-h">
      <h2 id="pie-h" class="text-lg font-semibold">Pie</h2>
      <app-example-box title="Pie chart example" [tabs]="pieTabs" class="mt-3 block max-w-2xl">
        <div xnChartCard #pie="xnChartCard" aria-label="Servers per region" class="h-64 w-full">
          <div class="h-full w-full">
            @defer (on viewport) {
              <ngx-charts-pie-chart
                [scheme]="$any(pie.scheme())"
                [results]="regions"
                [labels]="true"
                [doughnut]="true"
                [animations]="pie.animations()"
              />
            } @placeholder {
              <div class="h-full w-full animate-pulse rounded-md bg-muted"></div>
            }
          </div>
        </div>
      </app-example-box>
    </section>
  `,
})
export class ChartsDoc {
  protected readonly players = PLAYERS;
  protected readonly latency = LATENCY;
  protected readonly regions = REGIONS;

  protected readonly pieTabs = [
    {
      label: 'Angular',
      code: `<div xnChartCard #pie="xnChartCard" aria-label="Servers per region" class="h-64">
  <ngx-charts-pie-chart
    [scheme]="$any(pie.scheme())"
    [results]="regions"
    [labels]="true"
    [doughnut]="true"
  />
</div>`,
    },
    {
      label: 'TypeScript',
      code: `import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartCard } from '@xenode/ui';

@Component({
  imports: [NgxChartsModule, ChartCard],
  templateUrl: './regions.html',
})
export class Regions {
  protected readonly regions = [{ name: 'eu-west', value: 5 }];
}`,
    },
  ] as const;
}
