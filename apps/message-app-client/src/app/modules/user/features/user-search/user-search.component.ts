import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationUser } from '@shared-types';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { UserApiService } from '../../../../api';
import { UserItemComponent } from '../../components';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, UserItemComponent, MatIconModule, ReactiveFormsModule],
  template: `
    <!-- search input -->
    <div class="flex items-center gap-3">
      <mat-icon class="text-sky-500">search</mat-icon>
      <input
        [formControl]="searchUserControl"
        type="text"
        placeholder="Search user"
        class="border px-6 py-2 bg-gray-200 rounded-md w-full"
      />
    </div>

    <!-- results -->
    <div class="mt-10 flex flex-col gap-y-3 pl-4">
      @for (item of searchedUsers(); track item.userId) {
        <div class="border-b border-gray-400 pb-3">
          <app-user-item [userData]="item" [lastMessage]="item.lastMessage" />
        </div>
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
    ),
    {
      initialValue: [],
    },
  );

  onChange: (value: ApplicationUser) => void = () => {};
  onTouched = () => {};

  // ignore write from parent
  writeValue(obj: any): void {}

  registerOnChange(fn: UserSearchComponent['onChange']): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: UserSearchComponent['onTouched']): void {
    this.onTouched = fn;
  }
}
