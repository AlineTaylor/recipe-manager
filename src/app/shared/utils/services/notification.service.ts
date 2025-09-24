import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultDuration = 4000;

  success(message: string, action: string = 'Close', duration: number = 4000) {
    this.snackBar.open(message, action, {
      duration: duration ?? this.defaultDuration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  error(message: string, action: string = 'Close', duration: number = 6000) {
    this.snackBar.open(message, action, {
      duration: duration ?? 6000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  info(message: string, action: string = 'Close', duration: number = 4000) {
    this.snackBar.open(message, action, {
      duration: duration ?? this.defaultDuration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  dismiss() {
    this.snackBar.dismiss();
  }
}
