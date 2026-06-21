import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Partner } from '../../models/partner.model';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-partner-detail-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './partner-detail-modal.html',
})
export class PartnerDetailModal {
  partner = input.required<Partner>();
  policies = input<Policy[]>([]);
  closed = output<void>();

  close() {
    this.closed.emit();
  }

  getPartnerTypeLabel(typeId: number): string {
    return typeId === 1 ? 'Personal' : 'Legal';
  }
}
