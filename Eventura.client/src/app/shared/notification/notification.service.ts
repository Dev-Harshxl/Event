import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from './generic-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  // ✅ Snackbar for success or error messages
  showMessage(message: string, action: string = 'OK', duration: number = 4000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'],
    });
  }

  // ✅ Dialog for custom popups
  openDialog(title: string, message: string) {
    return this.dialog.open(GenericDialogComponent, {
      data: { title, message },
      width: '400px',
    });
  }
}
