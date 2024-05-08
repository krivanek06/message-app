import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationProgressComponent } from './notification-bar.component';

/**
 * Module has to be included in to page level (in apps folder) to be used in libraries
 */
@Injectable({
  providedIn: 'root',
})
export class DialogServiceUtil {
  private snackBar = inject(MatSnackBar, {
    optional: true,
  });

  showNotificationBar(
    message: string,
    type: 'success' | 'error' | 'notification' = 'notification',
    duration: number = 4000,
  ): void {
    if (!this.snackBar) {
      console.warn('DialogService.snackBar not initialized');
      return;
    }

    this.snackBar.openFromComponent(NotificationProgressComponent, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['g-custom-snack-bar'],
      duration,
      data: {
        message,
        type,
      },
    });
  }
}
