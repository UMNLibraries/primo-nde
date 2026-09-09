import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { UserFacade, ViewConfigFacade } from '@umn-nde/shared-state';
import type { IlliadApiResponse } from './illiad.types';
import { IlliadService } from './illiad.service';

const PRODUCTION_BASE_URL = 'https://pralma.lib.umn.edu/ill';
const SANDBOX_BASE_URL = 'https://pralma-dev.lib.umn.edu/ill';

describe('IlliadService', () => {
  interface SetupOptions {
    isSandbox?: boolean;
    jwt?: string;
  }

  function setup({ isSandbox = false, jwt = 'test-jwt' }: SetupOptions = {}) {
    const viewConfigFacade = { isSandbox: vi.fn().mockReturnValue(isSandbox) };
    const userFacade = { jwt: vi.fn().mockReturnValue(jwt) };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ViewConfigFacade, useValue: viewConfigFacade },
        { provide: UserFacade, useValue: userFacade },
      ],
    });

    const service = TestBed.inject(IlliadService);
    const httpController = TestBed.inject(HttpTestingController);

    return { service, httpController };
  }

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  describe('getRequests()', () => {
    it('calls the production requests URL when not in sandbox environment', async () => {
      const { service, httpController } = setup({ isSandbox: false });
      const promise = firstValueFrom(service.getRequests());
      httpController.expectOne(`${PRODUCTION_BASE_URL}/requests`).flush([]);
      await promise;
    });

    it('calls the sandbox requests URL when in sandbox environment', async () => {
      const { service, httpController } = setup({ isSandbox: true });
      const promise = firstValueFrom(service.getRequests());
      httpController.expectOne(`${SANDBOX_BASE_URL}/requests`).flush([]);
      await promise;
    });

    it('sends the JWT as an Authorization header', async () => {
      const { service, httpController } = setup({ jwt: 'my-jwt' });
      const promise = firstValueFrom(service.getRequests());
      const req = httpController.expectOne(`${PRODUCTION_BASE_URL}/requests`);
      expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt');
      req.flush([]);
      await promise;
    });

    it('normalizes API ILL request responses', async () => {
      const { service, httpController } = setup();
      const promise = firstValueFrom(service.getRequests());
      const apiResponse: IlliadApiResponse = [
        { TransactionNumber: 1, LoanTitle: 'Book One', LoanAuthor: 'Author A' },
      ];
      httpController
        .expectOne(`${PRODUCTION_BASE_URL}/requests`)
        .flush(apiResponse);
      const result = await promise;
      expect(result).toEqual([
        expect.objectContaining({
          txnNum: 1,
          title: 'Book One',
          author: 'Author A',
        }),
      ]);
    });

    it('returns an empty array on error', async () => {
      const { service, httpController } = setup();
      const promise = firstValueFrom(service.getRequests());
      httpController
        .expectOne(`${PRODUCTION_BASE_URL}/requests`)
        .flush('Error', { status: 500, statusText: 'Internal Server Error' });
      const result = await promise;
      expect(result).toEqual([]);
    });
  });

  describe('getArticles()', () => {
    it('calls the production articles URL when not in sandbox environment', async () => {
      const { service, httpController } = setup({ isSandbox: false });
      const promise = firstValueFrom(service.getArticles());
      httpController.expectOne(`${PRODUCTION_BASE_URL}/articles`).flush([]);
      await promise;
    });

    it('calls the sandbox articles URL when in sandbox environment', async () => {
      const { service, httpController } = setup({ isSandbox: true });
      const promise = firstValueFrom(service.getArticles());
      httpController.expectOne(`${SANDBOX_BASE_URL}/articles`).flush([]);
      await promise;
    });

    it('sends the JWT as an Authorization header', async () => {
      const { service, httpController } = setup({ jwt: 'my-jwt' });
      const promise = firstValueFrom(service.getArticles());
      const req = httpController.expectOne(`${PRODUCTION_BASE_URL}/articles`);
      expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt');
      req.flush([]);
      await promise;
    });

    it('normalizes API ILL article responses', async () => {
      const { service, httpController } = setup();
      const promise = firstValueFrom(service.getArticles());
      const apiResponse: IlliadApiResponse = [
        {
          TransactionNumber: 2,
          PhotoArticleTitle: 'Article One',
          PhotoArticleAuthor: 'Author B',
        },
      ];
      httpController
        .expectOne(`${PRODUCTION_BASE_URL}/articles`)
        .flush(apiResponse);
      const result = await promise;
      expect(result).toEqual([
        expect.objectContaining({
          txnNum: 2,
          title: 'Article One',
          author: 'Author B',
        }),
      ]);
    });

    it('returns an empty array on error', async () => {
      const { service, httpController } = setup();
      const promise = firstValueFrom(service.getArticles());
      httpController
        .expectOne(`${PRODUCTION_BASE_URL}/articles`)
        .flush('Error', { status: 500, statusText: 'Internal Server Error' });
      const result = await promise;
      expect(result).toEqual([]);
    });
  });
});
