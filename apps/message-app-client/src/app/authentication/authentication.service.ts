import { Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationUser } from '@shared-types';
import { BehaviorSubject } from 'rxjs';
import { StorageLocalStoreService } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends StorageLocalStoreService<ApplicationUser | null> {
  private authenticatedUser$ = new BehaviorSubject<ApplicationUser | null>(null);

  authenticatedUser = toSignal(this.authenticatedUser$);
  authenticatedUserData = computed(() => this.authenticatedUser()!);

  constructor() {
    // Initialize the storage service with the key and default value
    super('authenticatedUser', null);

    // console log changes
    this.authenticatedUser$.subscribe(console.log);

    // Load the user from local storage
    this.authenticatedUser$.next(this.getData());
  }

  getAuthenticatedUser() {
    return this.authenticatedUser$.asObservable();
  }

  setAuthenticatedUser(user: ApplicationUser | null) {
    this.authenticatedUser$.next(user);
    this.saveData(user);
  }
}
