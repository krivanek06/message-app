import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, catchError, delay, map, of, startWith, switchMap, tap } from 'rxjs';
import { UserApiService } from '../../api';
import { AuthenticationService } from '../../authentication';
import { DialogServiceUtil } from '../../utils';

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
            type="text"
            placeholder="Enter Username"
            class="border px-6 py-4 bg-gray-200 rounded-md w-[600px]"
            [formControl]="usernameControl"
            (keydown.enter)="onFormSubmit()"
          />

          <!-- submit button -->
          <button
            (click)="onFormSubmit()"
            [disabled]="isLoading()"
            type="button"
            class="bg-sky-300 hover:bg-sky-400 focus-within:bg-sky-400 text-white text-xl rounded-md min-w-[200px] max-w-[320px]"
          >
            Login
          </button>
        </div>
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
        }
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class LoginComponent {
  private authenticationService = inject(AuthenticationService);
  private userApiService = inject(UserApiService);
  private dialogServiceUtil = inject(DialogServiceUtil);
  private router = inject(Router);

  private createNewUserSubject$ = new Subject<string>();

  // todo: async call to check if username is available

  isLoading = toSignal(
    this.createNewUserSubject$.pipe(
      tap(() => this.dialogServiceUtil.showNotificationBar('Creating user...')),
      switchMap((userData) =>
        this.userApiService.createUser(userData).pipe(
          delay(2000), // Simulate network delay
          tap((user) => {
            console.log('user', user);
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
