import { AsyncPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormatHeaderCountPipe } from '../format-header-count.pipe';
import { articlePageUrl } from '../illiad-url.utils';
import { IlliadService } from '../illiad.service';

@Component({
  standalone: true,
  styleUrl: './digital-delivery.component.scss',
  templateUrl: './digital-delivery.component.html',
  imports: [
    AsyncPipe,
    SlicePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormatHeaderCountPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalDeliveryComponent {
  private illiadService = inject(IlliadService);
  allArticlesUrl = articlePageUrl();
  articles$ = this.illiadService.getArticles();
}
