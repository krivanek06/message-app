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

  // todo: when querying data - use scan because of pagination I want to remember last values
  getMessagesAll(offset: number): Observable<MessageChat[]> {
    return this.http
      .get<MessageChat[]>(`${environment.serverAPIEndpoint}/message/all?offset=${offset}`)
      .pipe(tap((x) => console.log('getMessagesAll', x, offset)));
  }
}
