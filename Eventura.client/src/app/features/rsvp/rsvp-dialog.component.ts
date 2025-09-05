import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rsvp-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>RSVP for {{ data.eventTitle }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" [disabled]="true"/>

        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Mobile Number</mat-label>
          <input matInput formControlName="mobile" placeholder="Enter mobile number" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Going">Going</mat-option>
            <mat-option value="Maybe">Maybe</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onConfirm()">Confirm</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }

    ::ng-deep .mat-mdc-text-field-wrapper,
    ::ng-deep .mat-mdc-select-trigger {
      color: wheat !important; /* Text color */
    }

    ::ng-deep input.mat-mdc-input-element,
    ::ng-deep .mat-mdc-select-value {
      color: wheat !important; /* Input/Select text */
    }

    ::ng-deep .mat-mdc-floating-label,
    ::ng-deep .mat-mdc-option {
      color: wheat !important; /* Label + dropdown options */
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      color: wheat !important; /* Helper/error text */
    }
  `],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class RsvpDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RsvpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventId: number, eventTitle: string, email: string }
  ) {
    this.form = this.fb.group({
      email: [data.email, Validators.required],
      mobile: [''],
      status: ['Going', Validators.required]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
