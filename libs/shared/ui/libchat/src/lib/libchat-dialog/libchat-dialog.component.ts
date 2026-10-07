import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface LibChatDialogData {
  url: string;
}

@Component({
  selector: 'umn-libchat-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './libchat-dialog.component.html',
  styleUrl: './libchat-dialog.component.scss',
})
export class LibChatDialogComponent {
  private readonly data = inject<LibChatDialogData>(MAT_DIALOG_DATA);
  private readonly sanitizer = inject(DomSanitizer);
  readonly url = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
}
