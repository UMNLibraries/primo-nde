import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProblemReportLinkComponent } from '@umn-nde/full-display';

@Component({
  standalone: true,
  imports: [ProblemReportLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<umn-problem-report-link
    baseUrl="https://www.lib.umn.edu/collections/fix-it"
    locationParam="refer"
    >Report an access issue</umn-problem-report-link
  >`,
})
export class TwinCitiesProblemReportLinkComponent {}
