import { Directive, computed, input, output, signal } from '@angular/core';

import { cn } from '../cn';

/**
 * File drop target. Drag state styles from data-drag-active; dropped files
 * emit through the `files` output. Always pair with a real
 * `<input type="file">` inside — drag-and-drop is an enhancement, never the
 * only path.
 */
@Directive({
  selector: '[xnDropzone]',
  host: {
    'data-slot': 'dropzone',
    '[attr.data-drag-active]': 'dragActive()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'dragActive.set(false)',
    '(drop)': 'onDrop($event)',
    '[class]': 'classes()',
  },
})
export class Dropzone {
  readonly files = output<FileList>();

  protected readonly dragActive = signal(false);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground transition-[border-color,background-color] data-[drag-active=true]:border-ring data-[drag-active=true]:bg-accent',
      this.userClass(),
    ),
  );

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(false);
    if (event.dataTransfer?.files?.length) {
      this.files.emit(event.dataTransfer.files);
    }
  }
}
