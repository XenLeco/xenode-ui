import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectAxeClean } from '../../testing/axe';
import { TABLE } from './table';

@Component({
  imports: [TABLE],
  template: `
    <div xnTableContainer>
      <table xnTable>
        <caption xnTableCaption>
          Recent deploys
        </caption>
        <thead xnTableHeader>
          <tr xnTableRow>
            <th xnTableHead scope="col">Commit</th>
            <th xnTableHead scope="col">Status</th>
          </tr>
        </thead>
        <tbody xnTableBody>
          <tr xnTableRow class="bg-red-500">
            <td xnTableCell>bcb7084</td>
            <td xnTableCell>green</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
class Host {}

describe('Table family', () => {
  it('renders every slot on native table elements', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    for (const slot of [
      'table-container',
      'table',
      'table-caption',
      'table-header',
      'table-body',
      'table-row',
      'table-head',
      'table-cell',
    ]) {
      expect(compiled.querySelector(`[data-slot="${slot}"]`), slot).toBeTruthy();
    }
    expect(compiled.querySelector('[data-slot="table-container"]')?.classList).toContain(
      'overflow-x-auto',
    );
  });

  it("merges the consumer's class last on rows", async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const row = (fixture.nativeElement as HTMLElement).querySelector('tbody tr');
    expect(row?.classList).toContain('bg-red-500');
    expect(row?.classList).toContain('border-b');
  });

  it('is axe-clean with proper th scoping', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    await expectAxeClean(fixture.nativeElement as Element);
  });
});
