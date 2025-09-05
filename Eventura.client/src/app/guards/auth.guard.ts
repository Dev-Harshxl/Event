import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { LoginPromptComponent } from '../auth/login-prompt.component';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const dialog = inject(MatDialog);

  return auth.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }

      dialog.open(LoginPromptComponent, {
        width: '400px',
        disableClose: true
      });

      return false;
    })
  );
};
