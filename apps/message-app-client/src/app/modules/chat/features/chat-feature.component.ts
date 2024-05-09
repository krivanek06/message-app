import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatWebSocket, MessageApiService } from '../../../api';
import { AuthenticationService } from '../../../authentication';
import { DefaultImgDirective, DialogServiceUtil, RangeDirective } from '../../../utils';

@Component({
  selector: 'app-chat-feature',
  standalone: true,
  imports: [CommonModule, DefaultImgDirective, RangeDirective, ReactiveFormsModule],
  template: `
    <!-- chat messages -->
    <div
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
      <div *ngRange="10" class="flex items-start gap-3">
        <!-- user -->
        <img appDefaultImg alt="user image" [src]="authUser().imageUrl" class="w-8 h-8 rounded-full" />

        <div
          class="w-9/12 p-4 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl"
          [style.background-color]="authUser().color"
        >
          <!-- messages metadata -->
          <div class="flex justify-between mb-2">
            <span class="font-bold"> Edaurd Krivanek </span>
            <span> 12.2.1223 12:12:12 </span>
          </div>
          <!-- messages -->
          <div>
            lorem ipsum dolor sit amet lorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor
            sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum
            dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem
            ipsum dolor sit amet
          </div>
        </div>
      </div>
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
