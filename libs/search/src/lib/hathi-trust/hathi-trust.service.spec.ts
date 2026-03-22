import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';

import { HathiTrustService } from './hathi-trust.service';
import { HathiTrustApiService } from './hathi-trust-api/hathi-trust-api.service';
import { HathiTrustConfigService } from './hathi-trust-config/hathi-trust-config.service';
import { HathiTrustQuery } from './hathi-trust-api/hathi-trust-api.model';

describe('HathiTrustService', () => {
  let service: HathiTrustService;
  let apiMock: { findFullTextUrl: ReturnType<typeof vi.fn> };
  let configMock: Partial<HathiTrustConfigService>;

  beforeEach(() => {
    apiMock = {
      findFullTextUrl: vi.fn(),
    };

    configMock = {
      matchOnIsbn: false,
      matchOnOclc: false,
      matchOnIssn: false,
      disableWhenAvailableOnline: false,
      disableForJournals: false,
      ignoreCopyright: false,
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HathiTrustApiService, useValue: apiMock },
        { provide: HathiTrustConfigService, useValue: configMock },
      ],
    });

    service = TestBed.inject(HathiTrustService);
  });

  it('returns undefined for non-local records', async () => {
    const doc = {
      context: 'X',
      pnx: { addata: {} },
      delivery: { GetIt1: [] },
    } as any;
    const v = await firstValueFrom(service.findFullTextFor(doc));
    expect(v).toBeUndefined();
  });

  it('returns undefined when the record has no searchable IDs', async () => {
    const doc = {
      context: 'L',
      pnx: { addata: {} },
      delivery: { GetIt1: [] },
    } as any;
    const v = await firstValueFrom(service.findFullTextFor(doc));
    expect(v).toBeUndefined();
    expect(apiMock.findFullTextUrl).not.toHaveBeenCalled();
  });

  it('passes ISBNs to HT API when matchOnIsbn is true', async () => {
    (configMock as any).matchOnIsbn = true;
    const returnedUrl = 'https://catalog.hathitrust.org/Record/123456789';
    apiMock.findFullTextUrl.mockReturnValue(of(returnedUrl));

    const doc = {
      context: 'L',
      pnx: { addata: { isbn: ['9781234567897'] } },
      delivery: { GetIt1: [] },
    } as any;

    const v = await firstValueFrom(service.findFullTextFor(doc));
    expect(v).toBe(returnedUrl);
    expect(apiMock.findFullTextUrl).toHaveBeenCalledWith(
      new HathiTrustQuery({ isbn: ['9781234567897'] })
    );
  });

  it('returns undefined when disableWhenAvailableOnline is true and doc has online availability', async () => {
    (configMock as any).disableWhenAvailableOnline = true;
    (configMock as any).matchOnOclc = true;
    const doc = {
      context: 'L',
      pnx: { addata: { oclcid: ['(OCoLC)12345'] } },
      delivery: { GetIt1: [{ links: [{ isLinktoOnline: true }] }] },
    } as any;

    apiMock.findFullTextUrl.mockReturnValue(of('should-not-be-called'));

    const v = await firstValueFrom(service.findFullTextFor(doc));
    expect(v).toBeUndefined();
    expect(apiMock.findFullTextUrl).not.toHaveBeenCalled();
  });

  it('passes OCLC IDs to HT API when matchOnOclc true', async () => {
    (configMock as any).matchOnOclc = true;
    const returnedUrl = 'https://catalog.hathitrust.org/Record/123456789';
    apiMock.findFullTextUrl.mockReturnValue(of(returnedUrl));

    const doc = {
      context: 'L',
      pnx: { addata: { oclcid: ['(OCoLC)12345', 'ocn6789', 'notoclc'] } },
      delivery: { GetIt1: [] },
    } as any;

    const v = await firstValueFrom(service.findFullTextFor(doc));
    expect(v).toBe(returnedUrl);
    expect(apiMock.findFullTextUrl).toHaveBeenCalledWith(
      new HathiTrustQuery({ oclc: ['12345', '6789'] })
    );
  });

  it('passes ISSNs to HT API when matchOnIssn is true', async () => {
    (configMock as any).matchOnIssn = true;
    (configMock as any).matchOnOclc = true;
    const returnedUrl = 'https://catalog.hathitrust.org/Record/123456789';
    apiMock.findFullTextUrl.mockReturnValue(of(returnedUrl));

    const doc = {
      context: 'L',
      pnx: {
        addata: {
          oclcid: ['(OCoLC)12345', 'ocn6789', 'notoclc'],
          issn: ['0028-0836'],
        },
      },
      delivery: { GetIt1: [] },
    } as any;

    const v = await firstValueFrom(service.findFullTextFor(doc));
    expect(v).toBe(returnedUrl);
    expect(apiMock.findFullTextUrl).toHaveBeenCalledWith(
      new HathiTrustQuery({ oclc: ['12345', '6789'], issn: ['0028-0836'] })
    );
  });

  it('returns undefined when disableForJournals true and record is a journal', async () => {
    (configMock as any).matchOnIssn = true;
    (configMock as any).disableForJournals = true;

    const doc = {
      context: 'L',
      pnx: { addata: { issn: ['0028-0836'], format: ['Journal'] } },
      delivery: { GetIt1: [] },
    } as any;

    apiMock.findFullTextUrl.mockReturnValue(of('should-not-be-called'));

    const v = await firstValueFrom(service.findFullTextFor(doc));
    expect(v).toBeUndefined();
    expect(apiMock.findFullTextUrl).not.toHaveBeenCalled();
  });
});
