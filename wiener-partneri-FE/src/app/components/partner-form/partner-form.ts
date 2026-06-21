import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PartnerType } from '../../models/partner.model';
import { PartnerService } from '../../services/partner';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partner-form.html',
})
export class PartnerForm {
  private fb = inject(FormBuilder);
  private partnerService = inject(PartnerService);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  PartnerType = PartnerType;

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    address: [''],
    partnerNumber: ['', [Validators.required, Validators.pattern(/^\d{20}$/)]],
    croatianPIN: ['', [Validators.pattern(/^\d{11}$/)]],
    partnerTypeId: [null as number | null, Validators.required],
    createdByUser: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    isForeign: [false, Validators.required],
    externalCode: ['', [Validators.minLength(10), Validators.maxLength(20)]],
    gender: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const value = this.form.value;

    this.partnerService
      .create({
        firstName: value.firstName!,
        lastName: value.lastName!,
        address: value.address || undefined,
        partnerNumber: value.partnerNumber!,
        croatianPIN: value.croatianPIN || undefined,
        partnerTypeId: Number(value.partnerTypeId),
        createdByUser: value.createdByUser!,
        isForeign: value.isForeign!,
        externalCode: value.externalCode || undefined,
        gender: value.gender!,
      })
      .subscribe({
        next: (res) => {
          this.router.navigate(['/'], { state: { newPartnerId: res.id } });
        },
        error: () => {
          this.isSubmitting.set(false);
          this.errorMessage.set('Greška pri spremanju partnera. Pokušajte ponovo.');
        },
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.errors?.[error] && control?.touched);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
