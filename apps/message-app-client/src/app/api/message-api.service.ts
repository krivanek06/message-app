import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageChat } from '@shared-types';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  private http = inject(HttpClient);
  getMessagesAll(offset: number): Observable<MessageChat[]> {
    return this.http
      .get<MessageChat[]>(`${environment.serverAPIEndpoint}/message/all?offset=${offset}`)
      .pipe(tap((x) => console.log('MessageApiService: getMessagesAll offset:', x, offset)));
  }

  getMessagesAllByUserId(userId: string): Observable<MessageChat[]> {
    return this.http.get<MessageChat[]>(
      `${environment.serverAPIEndpoint}/message/all-by-userId?userId=${userId}`,
    );
  }
}
