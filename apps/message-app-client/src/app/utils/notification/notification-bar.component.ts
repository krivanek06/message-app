import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification-bar',
  template: `
    <div class="flex flex-row gap-4 p-1 px-3">
      <!-- notification message -->
      <div *ngIf="data.type === 'notification'" class="flex items-center flex-1 gap-4">
        <mat-icon class="text-sky-400" fontIcon="notifications"></mat-icon>
        <span *ngIf="data.message"> {{ data.message }} </span>
      </div>

      <!-- success message -->
      <div *ngIf="data.type === 'success'" class="flex items-center flex-1 gap-4">
        <mat-icon class="text-green-400">check_circle</mat-icon>
        <span *ngIf="data.message"> {{ data.message }} </span>
      </div>

      <!-- error message -->
      <div *ngIf="data.type === 'error'" class="flex items-center flex-1 gap-4">
        <mat-icon class="text-red-400">report</mat-icon>
        <span *ngIf="data.message"> {{ data.message }} </span>
      </div>

      <!-- closing button -->
      <button (click)="closeSnackbar()" class="min-w-0">
        <mat-icon class="text-xl leading-9">close</mat-icon>
      </button>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  styles: `
    mat-icon {
      min-width: 30px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationProgressComponent {
  public data = inject<{ message: string; type: 'success' | 'error' | 'notification' }>(MAT_SNACK_BAR_DATA);
  private snackBarRef = inject(MatSnackBarRef<NotificationProgressComponent>);

  closeSnackbar(): void {
    this.snackBarRef.dismiss();
  }
}
