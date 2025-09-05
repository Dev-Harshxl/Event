// login.component.ts
import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../features/logo/logo.component';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  isReversed = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private layoutService: LayoutService,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngAfterViewInit() {
    // Create stars after view initializes
    setTimeout(() => {
      this.createStarfield();
    });
  }

  createStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) {
      console.error('Starfield element not found!');
      return;
    }

    starfield.innerHTML = '';

    // Create more stars for better visibility
    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div');
      const size =
        Math.random() > 0.85
          ? 'large'
          : Math.random() > 0.6
          ? 'medium'
          : 'small';
      const brightness = 0.6 + Math.random() * 0.4; // Brighter stars

      star.classList.add('star', size);
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 6}s`;
      star.style.opacity = `${brightness}`;

      // Add some variation in animation duration
      star.style.animationDuration = `${3 + Math.random() * 3}s`;

      starfield.appendChild(star);
    }
    console.log('Stars created successfully');
  }

  ngOnInit() {
    this.layoutService.isReversed$.subscribe((isReversed) => {
      this.isReversed = isReversed;
    });

    // Set initial state for login (not reversed)
    this.layoutService.setReversedState(false);

    const token = localStorage.getItem('accessToken');
    if (token) {
      this.notificationService.openDialog(
        'Already Logged In',
        'Logout first to login with another email'
      );
      this.router.navigate(['/home']);
    }
  }

  // Public method to set reversed state
  setReversedState(isReversed: boolean) {
    this.layoutService.setReversedState(isReversed);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.notificationService.showMessage('✅ Login successful!');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('❌ Login failed', err);
          const msg =
            err.error?.message || '❌ Login failed. Please check credentials.';
          this.notificationService.showMessage(msg);
        },
      });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
