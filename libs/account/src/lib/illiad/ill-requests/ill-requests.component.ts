import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IlliadService } from '../illiad.service';
import { NormalizedIllTransaction } from '../illiad.types';
import { requestPageUrl } from '../illiad-url.utils';

@Component({
  standalone: true,
  styleUrl: './ill-requests.component.scss',
  templateUrl: './ill-requests.component.html',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    SlicePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IllRequestsComponent {
  private illiadService = inject(IlliadService);
  allRequestsUrl = requestPageUrl();
  requests$ = this.illiadService.getRequests();

  headerCount(requests: NormalizedIllTransaction[]): string {
    const count = requests.length;
    return count === 0 ? '' : ` (${count})`;
  }
}

// TODO: add loading animation?
// TODO: do we need to worry about overflow (see ndeTooltipIfOverflow directive)
