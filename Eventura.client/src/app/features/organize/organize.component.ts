import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-organize',
  standalone: true,
  templateUrl: './organize.component.html',
  styleUrls: ['./organize.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NavbarComponent
    
  ]
})
export class OrganizeComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private notify: NotificationService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      eventDate: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.notify.showMessage('⚠️ Please fill out all required fields');
      return;
    }

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value !== null) {
        if (key === 'eventDate' && value instanceof Date) {
          formData.append(key, value.toISOString()); // ✅ Convert to ISO
        } else {
          formData.append(key, value as Blob | string);
        }
      }
    });

    this.http.post('https://localhost:7269/api/Events', formData).subscribe({
      next: () => this.notify.showMessage('✅ Event created successfully!'),
      error: (err) => {
        console.error('❌ Error creating event:', err);
        this.notify.openDialog('Error', 'Something went wrong while creating the event. Please try again.');
      }
    });
  }
}
