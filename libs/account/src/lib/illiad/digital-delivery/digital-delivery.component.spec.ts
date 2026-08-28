import { TestBed } from '@angular/core/testing';
import type { Observable } from 'rxjs';
import { Subject, of } from 'rxjs';
import { vi } from 'vitest';
import { IlliadService } from '../illiad.service';
import type { NormalizedIllTransaction } from '../illiad.types';
import { articlePageUrl } from '../illiad-url.utils';
import { DigitalDeliveryComponent } from './digital-delivery.component';

const makeArticle = (n: number): NormalizedIllTransaction => ({
  txnNum: n,
  title: `Article Title ${n}`,
  author: `Article Author ${n}`,
  url: `https://example.com/article/${n}`,
});

interface SetupOptions {
  articles$?: Observable<NormalizedIllTransaction[]>;
}

describe('DigitalDeliveryComponent', () => {
  async function setup({ articles$ = of([]) }: SetupOptions = {}) {
    const illiadService = {
      getArticles: vi.fn().mockReturnValue(articles$),
    };

    await TestBed.configureTestingModule({
      imports: [DigitalDeliveryComponent],
      providers: [{ provide: IlliadService, useValue: illiadService }],
    }).compileComponents();

    const fixture = TestBed.createComponent(DigitalDeliveryComponent);
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance, illiadService };
  }

  it('shows the loading state while articles are pending', async () => {
    const { fixture } = await setup({
      articles$: new Subject<NormalizedIllTransaction[]>(),
    });
    expect(fixture.nativeElement.textContent).toContain(
      'Loading digital delivery documents...',
    );
  });

  it('shows the empty state when there are no articles', async () => {
    const { fixture } = await setup({ articles$: of([]) });
    expect(fixture.nativeElement.textContent).toContain(
      'No digital delivery documents',
    );
  });

  it('shows article title and author when articles are present', async () => {
    const { fixture } = await setup({ articles$: of([makeArticle(1)]) });
    expect(fixture.nativeElement.textContent).toContain('Article Title 1');
    expect(fixture.nativeElement.textContent).toContain('Article Author 1');
  });

  it('shows the item count in the header when articles are present', async () => {
    const { fixture } = await setup({
      articles$: of([makeArticle(1), makeArticle(2)]),
    });
    expect(fixture.nativeElement.textContent).toContain('Digital Delivery (2)');
  });

  it('shows at most 3 articles when more than 3 are present', async () => {
    const articles = [1, 2, 3, 4].map(makeArticle);
    const { fixture } = await setup({ articles$: of(articles) });
    const listItems = fixture.nativeElement.querySelectorAll('li');
    expect(listItems.length).toBe(3);
  });

  it('sets allArticlesUrl to the ILLiad available-online page URL', async () => {
    const { component } = await setup();
    expect(component.allArticlesUrl).toBe(articlePageUrl());
  });

  it('links each article to its individual ILLiad URL', async () => {
    const article = makeArticle(42);
    const { fixture } = await setup({ articles$: of([article]) });
    const link = fixture.nativeElement.querySelector('li a');
    expect(link.getAttribute('href')).toBe(article.url);
  });

  it('links the footer to the full ILLiad digital delivery page', async () => {
    const { fixture } = await setup({ articles$: of([makeArticle(1)]) });
    const footerLink = fixture.nativeElement.querySelector('mat-card-footer a');
    expect(footerLink.getAttribute('href')).toBe(articlePageUrl());
  });
});
