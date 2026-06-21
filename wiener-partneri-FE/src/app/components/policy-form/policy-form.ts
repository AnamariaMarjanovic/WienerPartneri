import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PolicyService } from '../../services/policy';

@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './policy-form.html',
})
export class PolicyForm {
  private fb = inject(FormBuilder);
  private policyService = inject(PolicyService);

  partnerId = input.required<number>();
  closed = output<void>();

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    policyNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.policyService
      .create({
        partnerId: this.partnerId(),
        policyNumber: this.form.value.policyNumber!,
        amount: this.form.value.amount!,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closed.emit();
        },
        error: () => {
          this.isSubmitting.set(false);
          this.errorMessage.set('Greška pri spremanju police.');
        },
      });
  }

  close() {
    this.closed.emit();
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
