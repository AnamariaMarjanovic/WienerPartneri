import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model';
import { environment } from '../../environments/environment';

@Service()
export class PolicyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/policy`;

  getByPartnerId(partnerId: number): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/partner/${partnerId}`);
  }

  create(policy: Policy): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, policy);
  }

  getStats(partnerId: number): Observable<{ count: number; totalAmount: number }> {
    return this.http.get<{ count: number; totalAmount: number }>(
      `${this.apiUrl}/stats/${partnerId}`,
    );
  }
}
