import { TestBed } from '@angular/core/testing';
import { HathiTrustConfigService } from './hathi-trust-config.service';

describe('HathiTrustConfigService', () => {
  const TOKEN = 'MODULE_PARAMETERS';

  it('returns defaults when provided an empty parameters object', () => {
    TestBed.configureTestingModule({
      providers: [HathiTrustConfigService, { provide: TOKEN, useValue: {} }],
    });

    const service = TestBed.inject(HathiTrustConfigService);
    expect(service.disableWhenAvailableOnline).toBeTruthy(); // default true
    expect(service.disableForJournals).toBeFalsy(); // default false
    expect(service.ignoreCopyright).toBeFalsy(); // default false
    expect(service.matchOnOclc).toBeTruthy(); // default true
    expect(service.matchOnIsbn).toBeFalsy(); // default false
    expect(service.matchOnIssn).toBeFalsy(); // default false
  });

  it('respects explicit module parameter values', () => {
    TestBed.configureTestingModule({
      providers: [
        HathiTrustConfigService,
        {
          provide: TOKEN,
          useValue: {
            disableWhenAvailableOnline: false,
            disableForJournals: true,
            ignoreCopyright: true,
            matchOn: { oclc: false, isbn: true, issn: true, lccn: true },
          },
        },
      ],
    });

    const service = TestBed.inject(HathiTrustConfigService);
    expect(service.disableWhenAvailableOnline).toBeFalsy();
    expect(service.disableForJournals).toBeTruthy();
    expect(service.ignoreCopyright).toBeTruthy();
    expect(service.matchOnOclc).toBeFalsy();
    expect(service.matchOnIsbn).toBeTruthy();
    expect(service.matchOnIssn).toBeTruthy();
    expect(service.matchOnLccn).toBeTruthy();
  });

  it('falls back to defaults for missing keys and partial matchOn', () => {
    TestBed.configureTestingModule({
      providers: [
        HathiTrustConfigService,
        {
          provide: TOKEN,
          useValue: {
            // only override one top-level and one nested key
            disableWhenAvailableOnline: false,
            matchOn: { isbn: true }, // lccn, oclc and issn missing
          },
        },
      ],
    });

    const service = TestBed.inject(HathiTrustConfigService);
    expect(service.disableWhenAvailableOnline).toBeFalsy(); // provided
    expect(service.disableForJournals).toBeFalsy(); // default
    expect(service.ignoreCopyright).toBeFalsy(); // default
    expect(service.matchOnOclc).toBeTruthy(); // default true when missing
    expect(service.matchOnIsbn).toBeTruthy(); // provided true
    expect(service.matchOnIssn).toBeFalsy(); // default false when missing
    expect(service.matchOnLccn).toBeFalsy(); // default false when missing
  });
});
