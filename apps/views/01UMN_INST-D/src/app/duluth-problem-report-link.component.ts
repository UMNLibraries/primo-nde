import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProblemReportLinkComponent } from '@umn-nde/full-display';

@Component({
  standalone: true,
  imports: [ProblemReportLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<umn-problem-report-link
    baseUrl="https://d-umn.libwizard.com/f/report-a-problem"
    locationParam="3334539"
    >Report an access issue</umn-problem-report-link
  >`,
})
export class DuluthProblemReportLinkComponent {}
