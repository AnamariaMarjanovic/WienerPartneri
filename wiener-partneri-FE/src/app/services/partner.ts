import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { Partner } from '../models/partner.model';

@Service()
export class PartnerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/partner`;

  getAll(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
  ): Observable<PagedResult<Partner>> {
    let params = `?page=${page}&pageSize=${pageSize}`;
    if (search) params += `&search=${search}`;
    return this.http.get<PagedResult<Partner>>(`${this.apiUrl}${params}`);
  }

  getById(id: number): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/${id}`);
  }

  create(partner: Partner): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, partner);
  }
}
