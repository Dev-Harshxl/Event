// register.component.ts
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError } from '@angular/material/form-field';
import { LayoutService } from '../../services/layout.service';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../features/logo/logo.component';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../shared/popup/popup.service'; // ✅ import popup
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    MatError,
    LogoComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isReversed = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private layoutService: LayoutService,
    private authService: AuthService,
    private popupService: PopupService,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.layoutService.isReversed$.subscribe((isReversed) => {
      this.isReversed = isReversed;
    });

    // Set initial state for register (reversed)
    this.layoutService.setReversedState(true);

    const token = localStorage.getItem('accessToken');
    if (token) {
      this.notificationService.openDialog(
        'You are active session',"Logout first to Register new User"
      );
      this.router.navigate(['/home']);
    }
  }

  // Public method to set reversed state
  setReversedState(isReversed: boolean) {
    this.layoutService.setReversedState(isReversed);
  }

  // ✅ Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password, confirmPassword } =
        this.registerForm.value;

      this.authService
        .register(name, email, password, confirmPassword)
        .subscribe({
          next: () => {
            this.notificationService.showMessage(
              '✅ Registration successful! Please login.'
            );
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('❌ Register failed:', err);
            this.notificationService.showMessage(
              '❌ Registration failed. Please try again.'
            );
          },
        });
    }
  }

  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
