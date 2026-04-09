import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReportBrokenLinkComponent } from '@umn-nde/full-display';

@Component({
  standalone: true,
  imports: [ReportBrokenLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<umn-report-broken-link
    url="https://www.lib.umn.edu/collections/fix-it"
    locationParam="refer"
    >Report a broken link</umn-report-broken-link
  >`,
})
export class TwinCitiesReportBrokenLinkComponent {}
