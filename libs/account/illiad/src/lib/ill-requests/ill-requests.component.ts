import { AsyncPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormatHeaderCountPipe } from '../format-header-count.pipe';
import { requestPageUrl } from '../illiad-url.utils';
import { IlliadService } from '../illiad.service';

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
    FormatHeaderCountPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IllRequestsComponent {
  private illiadService = inject(IlliadService);
  allRequestsUrl = requestPageUrl();
  requests$ = this.illiadService.getRequests();
}

// TODO: add loading animation?
// TODO: do we need to worry about overflow (see ndeTooltipIfOverflow directive)
