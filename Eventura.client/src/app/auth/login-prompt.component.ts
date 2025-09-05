import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-prompt',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="login-prompt">
      <h2>Login Required</h2>
      <p>You must log in to see more details.</p>
      <button mat-raised-button color="primary" (click)="goToLogin()">Login</button>
    </div>
  `,
  styles: [`
    .login-prompt {
      text-align: center;
      padding: 2rem;
    }
    h2 { margin-bottom: 1rem; }
    p { margin-bottom: 1.5rem; }
  `]
})
export class LoginPromptComponent {
  constructor(
    private dialogRef: MatDialogRef<LoginPromptComponent>,
    private router: Router
  ) {}

  goToLogin() {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
}
