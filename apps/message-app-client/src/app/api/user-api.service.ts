import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { faker } from '@faker-js/faker';
import { ApplicationUser, ApplicationUserCreate, ApplicationUserSearch } from '@shared-types';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private http = inject(HttpClient);

  createUser(username: string): Observable<ApplicationUser> {
    const data = {
      username,
      imageUrl: faker.image.avatar(),
    } satisfies ApplicationUserCreate;
    return this.http.post<ApplicationUser>(`${environment.serverAPIEndpoint}/user`, data);
  }

  getLastActiveUsers() {
    return this.http.get<ApplicationUserSearch[]>(`${environment.serverAPIEndpoint}/user/last-active`);
  }

  getUsersByUsername(search: string) {
    return this.http.get<ApplicationUserSearch[]>(`${environment.serverAPIEndpoint}/user?search=${search}`);
  }
}
