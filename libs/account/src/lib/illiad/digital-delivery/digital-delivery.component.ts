import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IlliadService } from '../illiad.service';
import { NormalizedIllTransaction } from '../illiad.types';
import { articlePageUrl } from '../illiad-url.utils';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalDeliveryComponent {
  private illiadService = inject(IlliadService);
  allArticlesUrl = articlePageUrl();
  articles$ = this.illiadService.getArticles();

  headerCount(articles: NormalizedIllTransaction[]): string {
    const count = articles.length;
    return count === 0 ? '' : ` (${count})`;
  }
}
