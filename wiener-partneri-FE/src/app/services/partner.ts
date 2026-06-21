import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Partner } from '../models/partner.model';

@Service()
export class PartnerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/partner`;

  getAll(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.apiUrl);
  }

  getById(id: number): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiUrl}/${id}`);
  }

  create(partner: Partner): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, partner);
  }
}
