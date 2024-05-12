import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationUserSearch } from '@shared-types';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { UserApiService } from '../../../../api';
import { UserItemComponent } from '../../components';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, UserItemComponent, ReactiveFormsModule, MatButtonModule, MatIconModule],
  template: `
    <!-- search input -->
    <div class="flex items-center gap-3">
      <input
        data-testid="user-search-input"
        [formControl]="searchUserControl"
        type="text"
        placeholder="Search user"
        class="border px-6 py-2 bg-gray-200 rounded-md w-full"
      />
    </div>

    <!-- results -->
    <div class="mt-10 flex flex-col gap-y-3 pl-2">
      @if (selectedUser(); as selectedUser) {
        <!-- selected results -->
        <div class="border border-gray-600 py-2  bg-gray-600 rounded-lg">
          <app-user-item
            data-testid="user-search-user-selected"
            [userData]="selectedUser"
            [lastMessage]="selectedUser.lastMessage"
          />
        </div>

        <!-- cancel selection -->
        <button mat-stroked-button type="button" (click)="onUserClick(null)">
          <mat-icon class="text-gray-500">cancel</mat-icon>
          <span class="text-gray-400">cancel selection</span>
        </button>
      } @else {
        <!-- search results -->
        @for (item of searchedUsers(); track item.userId) {
          <div class="border-b border-gray-600 pb-1">
            <app-user-item
              data-testid="user-search-user-item"
              (itemClicked)="onUserClick(item)"
              [clickable]="true"
              [userData]="item"
              [lastMessage]="item.lastMessage"
            />
          </div>
        }
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserSearchComponent),
      multi: true,
    },
  ],
})
export class UserSearchComponent implements ControlValueAccessor {
  private userApiService = inject(UserApiService);

  searchUserControl = new FormControl('', { nonNullable: true });

  searchedUsers = toSignal(
    this.searchUserControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((search) =>
        search ? this.userApiService.getUsersByUsername(search) : this.userApiService.getLastActiveUsers(),
      ),
      catchError(() => EMPTY),
    ),
    {
      initialValue: [],
    },
  );

  /**
   * if user selected somebody, save value here
   */
  selectedUser = model<ApplicationUserSearch | null>(null);

  onChange: (value: ApplicationUserSearch | null) => void = () => {};
  onTouched = () => {};

  onUserClick(user: ApplicationUserSearch | null) {
    this.onChange(user);
    this.selectedUser.set(user);

    if (user) {
      // disable search
      this.searchUserControl.disable();
    } else {
      this.searchUserControl.enable();
      this.searchUserControl.patchValue('');
    }
  }

  // ignore write from parent
  writeValue(obj: any): void {}

  registerOnChange(fn: UserSearchComponent['onChange']): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: UserSearchComponent['onTouched']): void {
    this.onTouched = fn;
  }
}
