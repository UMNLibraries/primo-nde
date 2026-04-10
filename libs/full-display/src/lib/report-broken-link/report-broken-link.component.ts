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
  selector: 'umn-report-broken-link',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<a mat-button mat-flat-button target="_blank" [href]="targetUrl()"
    ><ng-content /><mat-icon>build</mat-icon><span></span
  ></a>`,
  styles: `
    mat-icon { color: var(--sys-on-primary); }
  `,
})
export class ReportBrokenLinkComponent {
  private document = inject(DOCUMENT);

  // base url for problem report form
  url = input.required<string>();

  // name of the parameter to pass the user's current location/page (optional)
  locationParam = input<string>();

  targetUrl = computed(() => {
    const base = new URL(this.url());
    const param = this.locationParam();
    if (param) {
      base.searchParams.append(param, this.document.location.href);
    }
    return base;
  });
}
