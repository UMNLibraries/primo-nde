import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'umn-problem-report-link',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents;' },
  template: `<a mat-flat-button target="_blank" [href]="targetUrl()">
    <mat-icon>build</mat-icon>
    <ng-content />
  </a>`,
  styles: `
    a:hover {
      text-decoration: none;
    }
    mat-icon {
      color: var(--sys-on-primary);
    }
  `,
})
export class ProblemReportLinkComponent {
  private document = inject(DOCUMENT);

  // base url for problem report form
  baseUrl = input.required<string>();

  // name of the parameter to pass the user's current location/page (optional)
  locationParam = input<string>();

  targetUrl = computed(() => {
    try {
      const base = new URL(this.baseUrl());
      const param = this.locationParam();
      if (param) {
        base.searchParams.append(param, this.document.location.href);
      }
      return base.toString();
    } catch (e) {
      return '#';
    }
  });
}
