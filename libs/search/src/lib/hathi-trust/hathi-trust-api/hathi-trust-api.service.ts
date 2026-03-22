import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, share, shareReplay } from 'rxjs';
import {
  HathiTrustMultiIdResponse,
  HathiTrustQuery,
  HathiTrustResponse,
} from './hathi-trust-api.model';
import { HathiTrustConfigService } from '../hathi-trust-config/hathi-trust-config.service';

const BASE_URL = 'https://catalog.hathitrust.org/api/volumes/brief/json/';

const responseExtractor =
  (query: HathiTrustQuery) =>
  (response: HathiTrustMultiIdResponse): HathiTrustResponse =>
    response[query.toString()];

@Injectable({
  providedIn: 'root',
})
export class HathiTrustApiService {
  private http: HttpClient = inject(HttpClient);
  private config = inject(HathiTrustConfigService);
  private readonly MAX_CACHE_SIZE = 100;
  // simple LRU cache for full-text URL queries
  private fullTextUrlCache = new Map<
    string,
    ReturnType<HathiTrustApiService['findFullTextUrl']>
  >();

  find(query: HathiTrustQuery): Observable<HathiTrustResponse> {
    return this.http
      .get<HathiTrustMultiIdResponse>(BASE_URL + query)
      .pipe(map(responseExtractor(query)), map(HathiTrustResponse.of));
  }

  findFullTextUrl(query: HathiTrustQuery): Observable<string | undefined> {
    if (this.fullTextUrlCache.has(query.toString())) {
      return this.fullTextUrlCache.get(query.toString())!;
    }

    const value$ = this.find(query).pipe(
      map((hathiTrustResponse) =>
        hathiTrustResponse.findFullViewUrl({
          ignoreCopyright: this.config.ignoreCopyright,
        })
      ),
      shareReplay(1)
    );

    this.fullTextUrlCache.set(query.toString(), value$);
    if (this.fullTextUrlCache.size > this.MAX_CACHE_SIZE) {
      const firstKey = this.fullTextUrlCache.keys().next().value!;
      this.fullTextUrlCache.delete(firstKey);
    }

    return value$;
  }
}
