import { Component, input } from '@angular/core';

import { CodeBlock, CopyButton } from '@xenode/ui';

/**
 * A copy-paste code section for the docs — our own CodeBlock + CopyButton
 * composed, so every snippet is selectable AND one click away.
 */
@Component({
  selector: 'app-code-snippet',
  imports: [CodeBlock, CopyButton],
  template: `
    <div class="relative" data-slot="code-snippet">
      <pre xnCodeBlock [attr.aria-label]="label()"><code>{{ code() }}</code></pre>
      <button
        [xnCopyButton]="code()"
        class="absolute top-2 right-2"
        [attr.aria-label]="'Copy ' + label()"
      >
        Copy
      </button>
    </div>
  `,
})
export class CodeSnippet {
  readonly code = input.required<string>();
  readonly label = input('code example');
}
