import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserFacade } from '@umn-nde/shared-state';
import { ViewConfigFacade } from '@umn-nde/shared-state';
import { map, Observable } from 'rxjs';
import { IlliadApiResponse, NormalizedIllTransaction } from './illiad.types';
import {
  normalizeArticleTransactions,
  normalizeRequestTransactions,
} from './illiad.mapper';

@Injectable({
  providedIn: 'root',
})
export class IlliadService {
  private http = inject(HttpClient);
  private userFacade = inject(UserFacade);
  private viewConfigFacade = inject(ViewConfigFacade);
  private baseUrl = this.viewConfigFacade.isSandbox()
    ? 'https://pralma-dev.lib.umn.edu/ill'
    : 'https://pralma.lib.umn.edu/ill';

  getRequests(): Observable<NormalizedIllTransaction[]> {
    return this.get(`${this.baseUrl}/requests`).pipe(
      map(normalizeRequestTransactions)
    );
  }

  getArticles(): Observable<NormalizedIllTransaction[]> {
    return this.get(`${this.baseUrl}/articles`).pipe(
      map(normalizeArticleTransactions)
    );
  }

  private get(url: string) {
    const headers = { Authorization: `Bearer ${this.userFacade.jwt()}` };
    return this.http.get<IlliadApiResponse>(url, { headers });
  }
}
