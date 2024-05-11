import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, delay, map, of } from 'rxjs';
import { UserApiService } from '../../api';

@Injectable({
  providedIn: 'root',
})
export class UsernameValidation implements AsyncValidator {
  private userApiService = inject(UserApiService);

  validate(control: AbstractControl<string>): Observable<ValidationErrors | null> {
    const value = control.value;
    if (!value) {
      return of(null);
    }

    return this.userApiService.getUsersByUsername(value).pipe(
      delay(1000), // Simulate network delay
      map((users) => {
        const userExists = users.find(
          (user) => user.username.toLocaleLowerCase() === value.toLocaleLowerCase(),
        );

        if (userExists) {
          return { usernameTaken: true };
        }
        return null;
      }),
    );
  }
}
