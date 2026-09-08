import { TestBed } from '@angular/core/testing';
import type { Observable } from 'rxjs';
import { Subject, of } from 'rxjs';
import { vi } from 'vitest';
import { IlliadService } from '../illiad.service';
import type { NormalizedIllTransaction } from '../illiad.types';
import { requestPageUrl } from '../illiad-url.utils';
import { IllRequestsComponent } from './ill-requests.component';

const makeRequest = (n: number): NormalizedIllTransaction => ({
  txnNum: n,
  title: `Title ${n}`,
  author: `Author ${n}`,
  url: `https://example.com/request/${n}`,
});

interface SetupOptions {
  requests$?: Observable<NormalizedIllTransaction[]>;
}

describe('IllRequestsComponent', () => {
  async function setup({ requests$ = of([]) }: SetupOptions = {}) {
    const illiadService = {
      getRequests: vi.fn().mockReturnValue(requests$),
    };

    await TestBed.configureTestingModule({
      imports: [IllRequestsComponent],
      providers: [{ provide: IlliadService, useValue: illiadService }],
    }).compileComponents();

    const fixture = TestBed.createComponent(IllRequestsComponent);
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance, illiadService };
  }

  it('shows the loading state while requests are pending', async () => {
    const { fixture } = await setup({
      requests$: new Subject<NormalizedIllTransaction[]>(),
    });
    expect(fixture.nativeElement.textContent).toContain(
      'Loading interlibrary loan requests...',
    );
  });

  it('shows the empty state when there are no requests', async () => {
    const { fixture } = await setup({ requests$: of([]) });
    expect(fixture.nativeElement.textContent).toContain(
      'No pending interlibrary loan requests',
    );
  });

  it('shows request title and author when requests are present', async () => {
    const { fixture } = await setup({ requests$: of([makeRequest(1)]) });
    expect(fixture.nativeElement.textContent).toContain('Title 1');
    expect(fixture.nativeElement.textContent).toContain('Author 1');
  });

  it('shows the item count in the header when requests are present', async () => {
    const { fixture } = await setup({
      requests$: of([makeRequest(1), makeRequest(2)]),
    });
    expect(fixture.nativeElement.textContent).toContain(
      'Pending Interlibrary Loan Requests (2)',
    );
  });

  it('shows at most 3 requests when more than 3 are present', async () => {
    const requests = [1, 2, 3, 4].map(makeRequest);
    const { fixture } = await setup({ requests$: of(requests) });
    const listItems = fixture.nativeElement.querySelectorAll('li');
    expect(listItems.length).toBe(3);
  });

  it('sets allRequestsUrl to the ILLiad on-order requests page URL', async () => {
    const { component } = await setup();
    expect(component.allRequestsUrl).toBe(requestPageUrl());
  });

  it('links each request to its individual ILLiad URL', async () => {
    const request = makeRequest(42);
    const { fixture } = await setup({ requests$: of([request]) });
    const link = fixture.nativeElement.querySelector('li a');
    expect(link.getAttribute('href')).toBe(request.url);
  });

  it('links the footer to the full ILLiad requests page', async () => {
    const { fixture } = await setup({ requests$: of([makeRequest(1)]) });
    const footerLink = fixture.nativeElement.querySelector('mat-card-footer a');
    expect(footerLink.getAttribute('href')).toBe(requestPageUrl());
  });
});
