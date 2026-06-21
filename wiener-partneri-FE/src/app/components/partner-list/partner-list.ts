import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerService } from '../../services/partner';
import { PolicyService } from '../../services/policy';
import { Partner, PartnerType } from '../../models/partner.model';
import { Policy } from '../../models/policy.model';
import { CommonModule, DatePipe } from '@angular/common';
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

  ngOnInit() {
    this.loadPartners();
    const nav = history.state;
    if (nav?.newPartnerId) {
      this.newPartnerId.set(nav.newPartnerId);
    }
  }

  loadPartners() {
    this.isLoading.set(true);
    this.partnerService.getAll().subscribe({
      next: (data) => {
        this.partners.set(data);
        this.isLoading.set(false);
        this.loadAllStats(data);
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
}
