import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReportBrokenLinkComponent } from '@umn-nde/full-display';

@Component({
  standalone: true,
  imports: [ReportBrokenLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<umn-report-broken-link
    url="https://d-umn.libwizard.com/f/report-a-problem"
    locationParam="3334539"
    >Report a broken link</umn-report-broken-link
  >`,
})
export class DuluthReportBrokenLinkComponent {}
