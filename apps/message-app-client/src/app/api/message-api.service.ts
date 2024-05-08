import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageChat } from '@shared-types';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageApiService {
  private http = inject(HttpClient);

  getMessagesAll(limit: number, offset: number): Observable<MessageChat[]> {
    return this.http.get<MessageChat[]>(
      `${environment.serverAPIEndpoint}/message/all?limit=${limit}&offset=${offset}`,
    );
  }
}
