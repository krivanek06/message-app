import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { UserApiService } from '../../api';
import { AuthenticationService } from '../../authentication';
import { DialogServiceUtil } from '../../utils';
import { UsernameValidation } from '../../utils/validation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="h-screen bg-gray-100 pt-[300px]">
      <div class="px-6 py-4 shadow-md mx-auto w-fit  bg-white rounded-md">
        <div class="flex flex-row gap-6">
          <!-- input text -->
          <input
            data-testid="login-username-input"
            type="text"
            placeholder="Enter Username"
            class="border px-6 py-4 bg-gray-200 rounded-md w-[600px]"
            [formControl]="usernameControl"
            (keydown.enter)="onFormSubmit()"
          />

          <!-- submit button -->
          <button
            data-testid="login-submit-button"
            (click)="onFormSubmit()"
            [disabled]="isLoading() || usernameControl.pending || usernameControl.invalid"
            type="button"
            class="bg-sky-300 hover:bg-sky-400 focus-within:bg-sky-400 text-white text-xl rounded-md min-w-[200px] max-w-[320px]"
          >
            Login
          </button>
        </div>

        <!-- pending state & trigger CD -->
        @if (usernameControl.statusChanges | async) {
          @if (usernameControl.pending) {
            <div class="text-gray-500 text-sm">Checking username...</div>
          }
        }

        <!-- errors -->
        @if (usernameControl.invalid && usernameControl.touched) {
          @if (usernameControl.errors?.['required']) {
            <div class="text-red-500 text-sm">Username is required</div>
          }
          @if (usernameControl.errors?.['minlength']) {
            <div class="text-red-500 text-sm">Username must be at least 5 characters</div>
          }
          @if (usernameControl.errors?.['maxlength']) {
            <div class="text-red-500 text-sm">Username must be at most 20 characters</div>
          }
          @if (usernameControl.errors?.['usernameTaken']) {
            <div class="text-red-500 text-sm">Username is already taken</div>
          }
        }
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authenticationService = inject(AuthenticationService);
  private userApiService = inject(UserApiService);
  private dialogServiceUtil = inject(DialogServiceUtil);
  private router = inject(Router);
  private usernameValidation = inject(UsernameValidation);

  private createNewUserSubject$ = new Subject<string>();

  isLoading = toSignal(
    this.createNewUserSubject$.pipe(
      tap(() => this.dialogServiceUtil.showNotificationBar('Creating user...')),
      switchMap((userData) =>
        this.userApiService.createUser(userData).pipe(
          tap((user) => {
            // show notification
            this.dialogServiceUtil.showNotificationBar('User created', 'success');

            // save user
            this.authenticationService.setAuthenticatedUser(user);

            // redirect into the app
            this.router.navigate(['/chat-room']);
          }),
          map(() => false), // Set loading to false
          catchError((error) => {
            console.error('error', error);
            this.dialogServiceUtil.showNotificationBar('Error creating user', 'error');
            return of(false);
          }),
          startWith(true), // Set loading to true
        ),
      ),
    ),
    { initialValue: false },
  );

  usernameControl = new FormControl('', {
    validators: [Validators.required, Validators.minLength(5), Validators.maxLength(20)],
    asyncValidators: [this.usernameValidation.validate.bind(this.usernameValidation)],
    nonNullable: true,
  });

  onFormSubmit(): void {
    // mark as touched
    this.usernameControl.markAsTouched();

    // submit if valid
    if (!this.usernameControl.invalid) {
      this.createNewUserSubject$.next(this.usernameControl.value);
    }
  }
}
