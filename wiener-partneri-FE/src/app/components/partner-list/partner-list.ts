import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PagedResult } from '../../models/paged-result.model';
import { Partner, PartnerType } from '../../models/partner.model';
import { Policy } from '../../models/policy.model';
import { PartnerService } from '../../services/partner';
import { PolicyService } from '../../services/policy';
import { PartnerDetailModal } from '../partner-detail-modal/partner-detail-modal';
import { PolicyForm } from '../policy-form/policy-form';

@Component({
  selector: 'app-partner-list',
  standalone: true,
  imports: [CommonModule, DatePipe, PartnerDetailModal, PolicyForm],
  templateUrl: './partner-list.html',
})
export class PartnerList implements OnInit {
  private partnerService = inject(PartnerService);
  private policyService = inject(PolicyService);
  private router = inject(Router);

  partners = signal<Partner[]>([]);
  selectedPartner = signal<Partner | null>(null);
  partnerPolicies = signal<Policy[]>([]);
  policyPartnerId = signal<number | null>(null);
  newPartnerId = signal<number | null>(null);
  partnerStats = signal<Map<number, { count: number; totalAmount: number }>>(new Map());
  isLoading = signal(false);

  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  totalCount = signal(0);
  searchTerm = signal('');

  ngOnInit() {
    this.loadPartners();
    const nav = history.state;
    if (nav?.newPartnerId) {
      this.newPartnerId.set(nav.newPartnerId);
    }
  }

  loadPartners() {
    this.isLoading.set(true);
    this.partnerService
      .getAll(this.currentPage(), this.pageSize(), this.searchTerm() || undefined)
      .subscribe({
        next: (data: PagedResult<Partner>) => {
          this.partners.set(data.items);
          this.totalPages.set(data.totalPages);
          this.totalCount.set(data.totalCount);
          this.isLoading.set(false);
          this.loadAllStats(data.items);
        },
        error: () => this.isLoading.set(false),
      });
  }

  loadAllStats(partners: Partner[]) {
    partners.forEach((partner) => {
      if (partner.id) {
        this.policyService.getStats(partner.id).subscribe({
          next: (stats) => {
            const map = new Map(this.partnerStats());
            map.set(partner.id!, stats);
            this.partnerStats.set(map);
          },
        });
      }
    });
  }

  isMarked(partner: Partner): boolean {
    const stats = this.partnerStats().get(partner.id!);
    if (!stats) return false;
    return stats.count > 5 || stats.totalAmount > 5000;
  }

  selectPartner(partner: Partner) {
    this.selectedPartner.set(partner);
    if (partner.id) {
      this.policyService.getByPartnerId(partner.id).subscribe({
        next: (policies) => this.partnerPolicies.set(policies),
      });
    }
  }

  closeModal() {
    this.selectedPartner.set(null);
    this.partnerPolicies.set([]);
  }

  openPolicyDialog(partnerId: number) {
    this.policyPartnerId.set(partnerId);
  }

  closePolicyDialog() {
    this.policyPartnerId.set(null);
    this.loadPartners();
  }

  goToNewPartner() {
    this.router.navigate(['/partner/new']);
  }

  getPartnerTypeLabel(typeId: number): string {
    return typeId === PartnerType.Personal ? 'Personal' : 'Legal';
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadPartners();
    }
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadPartners();
  }

  pages() {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
