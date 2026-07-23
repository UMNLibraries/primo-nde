import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';
import {
  HathiTrustComponent,
  NdeOnlineAvailability,
} from './hathi-trust.component';
import { HathiTrustService } from './hathi-trust.service';
import { SearchResultFacade } from './primo-search-result/search-result.facade';
import { TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { Doc } from './primo-search-result/search.model';

describe('HathiTrustComponent', () => {
  let component: HathiTrustComponent;
  let hathiTrustService: { findFullTextFor: ReturnType<typeof vi.fn> };
  let searchResultFacade: {
    getSearchResult: ReturnType<typeof vi.fn>;
    currentFullDisplay$?: unknown;
  };
  let translateService: { get: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    hathiTrustService = {
      findFullTextFor: vi.fn(),
    };

    searchResultFacade = {
      getSearchResult: vi.fn(),
    };

    translateService = {
      get: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HathiTrustComponent],
      providers: [
        { provide: HathiTrustService, useValue: hathiTrustService },
        { provide: SearchResultFacade, useValue: searchResultFacade },
        { provide: TranslateService, useValue: translateService },
      ],
    }).compileComponents();

    // override template to avoid rendering auxiliary components
    TestBed.overrideComponent(HathiTrustComponent, {
      set: { template: '' },
    });

    translateService.get.mockReturnValue(of('HathiTrust.availabilityText'));
  });

  it('uses currentFullDisplay$ when hostComponent.isFullDisplay is true', async () => {
    const record = { pnx: { control: { recordid: ['123'] } } };
    searchResultFacade.currentFullDisplay$ = of(record);
    hathiTrustService.findFullTextFor.mockReturnValue(
      of('http://example.com/123'),
    );

    const fixture = TestBed.createComponent(HathiTrustComponent);
    component = fixture.componentInstance;
    component.hostComponent = {
      isFullDisplay: true,
      searchResult: record,
    } as NdeOnlineAvailability;

    const url = await firstValueFrom(component.fullTextUrl$);
    expect(url).toBe('http://example.com/123');
    expect(hathiTrustService.findFullTextFor).toHaveBeenCalledWith(record);
  });

  it('calls getSearchResult when hostComponent.isFullDisplay is false', async () => {
    const hostComponentRecord = {
      pnx: { control: { recordid: ['123'] } },
    } as Doc;
    const storeRecord = { pnx: { control: { recordid: ['123'] } } };
    searchResultFacade.getSearchResult.mockReturnValue(of(storeRecord));
    hathiTrustService.findFullTextFor.mockReturnValue(
      of('http://example.com/123'),
    );

    const fixture = TestBed.createComponent(HathiTrustComponent);
    component = fixture.componentInstance;
    component.hostComponent = {
      isFullDisplay: false,
      searchResult: hostComponentRecord,
    } as NdeOnlineAvailability;

    const url = await firstValueFrom(component.fullTextUrl$);
    expect(url).toBe('http://example.com/123');
    expect(searchResultFacade.getSearchResult).toHaveBeenCalledWith('123');
    expect(hathiTrustService.findFullTextFor).toHaveBeenCalledWith(storeRecord);
  });

  it('maps untranslated availability key to default text', async () => {
    translateService.get.mockReturnValue(of('HathiTrust.availabilityText'));
    const fixture = TestBed.createComponent(HathiTrustComponent);
    component = fixture.componentInstance;
    const text = await firstValueFrom(component.availabilityText$);
    expect(text).toBe('Full text from HathiTrust');
  });

  it('uses translated availability text when available', async () => {
    translateService.get.mockReturnValue(of('Yay! Available via HathiTrust'));
    const fixture = TestBed.createComponent(HathiTrustComponent);
    component = fixture.componentInstance;
    const text = await firstValueFrom(component.availabilityText$);
    expect(text).toBe('Yay! Available via HathiTrust');
  });
});
