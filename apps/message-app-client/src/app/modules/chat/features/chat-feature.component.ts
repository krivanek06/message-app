import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, delay, map, of, startWith, tap } from 'rxjs';
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
      </div>

      <!-- messages wrapper -->
      @if (!displayedMessages().loading) {
        @for (item of displayedMessages().data; track item.messageId) {
          <div class="flex items-start gap-3">
            <!-- user -->
            <img appDefaultImg alt="user image" [src]="item.user.imageUrl" class="w-8 h-8 rounded-full" />

            <div
              class="w-9/12 p-4 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl"
              [style.background-color]="item.user.color"
            >
              <!-- messages metadata -->
              <div class="flex justify-between mb-2">
                <span class="font-bold"> {{ item.user.username }} </span>
                <span> {{ item.timestamp | date: 'HH:mm, MMMM d, y' }} </span>
              </div>
              <!-- messages -->
              <div>
                {{ item.content }}
              </div>
            </div>
          </div>
        }
      } @else {
        <div
          *ngRange="10"
          class="g-skeleton min-h-[80px] w-9/12 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl"
        ></div>
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

  displayedMessages = toSignal(
    this.messageApiService.getMessagesAll(0).pipe(
      delay(2000), // simulate loading
      tap(console.log),
      map((data) => ({
        data,
        loading: false,
      })),
      startWith({
        data: [],
        loading: true,
      }),
      catchError((err) => {
        console.log(err);
        this.dialogServiceUtil.showNotificationBar('Error loading messages', 'error');
        return of({
          data: [],
          loading: false,
        });
      }),
    ),
    {
      initialValue: {
        data: [],
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
    }

    // submit message
    this.chatWebSocket.sendNewMEssage({
      content: this.messageControl.value,
      userId: this.authUser().userId,
    });

    // reset previous value
    this.messageControl.reset();
  }
}
