// login.component.ts
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service'; 
import { CommonModule } from '@angular/common';

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
    MatError
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isReversed = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private layoutService: LayoutService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.layoutService.isReversed$.subscribe(isReversed => {
      this.isReversed = isReversed;
    });
    
    // Set initial state for login (not reversed)
    this.layoutService.setReversedState(false);
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
          console.log('✅ Login successful');
          this.router.navigate(['/home']);
        },
        error: (err: { error: any; }) => {
          console.error('❌ Login failed', err);
          if (err.error && err.error.message) {
            alert(`❌ ${err.error.message}`);
          } else {
            alert('❌ Login failed. Please check your credentials or try again.');
          }
        }
      });
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}