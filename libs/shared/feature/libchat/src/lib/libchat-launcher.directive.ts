import { Directive, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  LibChatDialogComponent,
  LibChatDialogData,
} from './libchat-dialog/libchat-dialog.component';

@Directive({
  selector: 'a[umnLibChatLauncher]',
  standalone: true,
  host: {
    '(click)': 'openChat($event)',
  },
})
export class LibChatLauncherDirective {
  private readonly dialog = inject(MatDialog);
  href = input.required<string>();

  openChat(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey) return;

    event.preventDefault();

    this.dialog.open(LibChatDialogComponent, {
      panelClass: 'libchat-dialog-panel',
      height: '500px',
      width: '400px',
      autoFocus: false,
      ariaLabel: 'Live Chat with a Librarian',
      data: { url: this.href() } as LibChatDialogData,
    });
  }
}
