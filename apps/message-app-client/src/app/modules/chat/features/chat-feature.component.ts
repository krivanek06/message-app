import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageChat } from '@shared-types';
import { Subject, catchError, combineLatest, delay, map, of, scan, startWith, switchMap, tap } from 'rxjs';
import { ChatWebSocket, MessageApiService } from '../../../api';
import { AuthenticationService } from '../../../authentication';
import {
  DefaultImgDirective,
  DialogServiceUtil,
  RangeDirective,
  ScrollNearEndDirective,
} from '../../../utils';

@Component({
  selector: 'app-chat-feature',
  standalone: true,
  imports: [CommonModule, DefaultImgDirective, RangeDirective, ReactiveFormsModule, ScrollNearEndDirective],
  template: `
    <!-- chat messages -->
    <div
      appScrollNearEnd
      (nearEnd)="onNearEndEmit()"
      class="px-4 py-6 border-gray-300 h-full rounded-lg border-2 overflow-scroll flex flex-col-reverse gap-y-6"
    >
      <!-- input message -->
      <div class="flex flex-col">
        <label for="inputMessage">Enter Message</label>
        <textarea
          [formControl]="messageControl"
          (keydown.enter)="onEnter($event)"
          name="inputMessage"
          rows="5"
          cols="33"
          placeholder="Enter message and press enter to send"
          class="border-2 border-gray-300 rounded-md p-2 "
        ></textarea>
        <span class="text-sm text-gray-400">chars: {{ messageControl.value.length }} / 1000 </span>
      </div>

      <!-- messages wrapper -->

      @for (item of displayedMessages().data; track item.messageId) {
        <div class="flex items-start gap-3">
          <!-- user -->
          <img appDefaultImg alt="user image" [src]="item.user?.imageUrl" class="w-8 h-8 rounded-full" />

          <div
            class="w-9/12 p-4 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl border border-gray-200"
            [style.background-color]="item.user?.color"
          >
            <!-- messages metadata -->
            <div class="flex justify-between mb-2">
              <span class="font-bold"> {{ item.user?.username ?? 'Unknown' }} </span>
              <span> {{ item.timestamp | date: 'HH:mm, MMMM d, y' }} </span>
            </div>
            <!-- messages -->
            <div class="whitespace-pre-wrap">
              {{ item.content }}
            </div>
          </div>
        </div>
      }
      <!-- display loading skeleton -->
      @if (displayedMessages().loading) {
        <div *ngRange="10" class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full g-skeleton"></div>
          <div class="g-skeleton min-h-[80px] w-9/12 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl"></div>
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
})
export class ChatFeatureComponent {
  private messageApiService = inject(MessageApiService);
  private chatWebSocket = inject(ChatWebSocket);
  private dialogServiceUtil = inject(DialogServiceUtil);
  private authenticationService = inject(AuthenticationService);

  authUser = this.authenticationService.authenticatedUserData;

  /**
   * subject to emit new scroll event happens with how many items are displayed
   */
  private scrollNewEndOffset$ = new Subject<number>();

  /**
   * observable to load messages from API based on scroll position
   */
  private loadedMessages$ = this.scrollNewEndOffset$.pipe(
    startWith(0),
    switchMap((offset) =>
      this.messageApiService.getMessagesAll(offset).pipe(
        // stop loading
        map((data) => ({ data, loading: false })),
        // simulate loading
        delay(2000),
        catchError((err) => {
          console.log(err);
          this.dialogServiceUtil.showNotificationBar('Error loading messages', 'error');
          return of({ data: [], loading: false });
        }),
        // show loading skeleton while loading data from API
        startWith({ data: [], loading: true }),
      ),
    ),
    // remember previous values and add new ones
    scan(
      (acc, curr) => ({
        data: [...acc.data, ...curr.data],
        loading: curr.loading,
      }),
      {
        data: [] as MessageChat[],
        loading: true,
      },
    ),
  );

  /**
   * observable to listen on new incoming messages
   */
  private newIncomingMessage$ = this.chatWebSocket.listenOnNewMessage().pipe(startWith([] as MessageChat[]));

  /**
   * combine latest loaded messages and new incoming messages and display on UI
   */
  displayedMessages = toSignal(
    combineLatest([this.loadedMessages$, this.newIncomingMessage$]).pipe(
      tap(([loaded, incoming]) => console.log('loaded', loaded, 'incoming', incoming)),
      map(([loaded, incoming]) => ({
        data: [...incoming, ...loaded.data],
        loading: loaded.loading,
      })),
    ),
    {
      initialValue: {
        data: [] as MessageChat[],
        loading: true,
      },
    },
  );

  messageControl = new FormControl('', {
    validators: [Validators.required, Validators.minLength(1), Validators.maxLength(1000)],
    nonNullable: true,
  });

  onEnter(event: Event) {
    // prevent default behavior - new line
    event.preventDefault();

    this.messageControl.markAllAsTouched();
    if (this.messageControl.invalid) {
      this.dialogServiceUtil.showNotificationBar('Message is required, min 1 char, max 1000', 'error');
      return;
    }

    // submit message
    this.chatWebSocket.sendNewMEssage({
      content: this.messageControl.value,
      userId: this.authUser().userId,
    });

    // reset previous value
    this.messageControl.reset();
  }

  onNearEndEmit() {
    this.scrollNewEndOffset$.next(this.displayedMessages().data.length);
  }
}
