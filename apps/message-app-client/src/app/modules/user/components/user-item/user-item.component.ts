import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ApplicationUser, MessageStored } from '@shared-types';
import { ClickableDirective, DefaultImgDirective } from '../../../../utils';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [CommonModule, DefaultImgDirective, ClickableDirective],
  template: `
    <div class="flex items-start gap-2 px-3 py-1">
      <!-- user image -->
      <img appDefaultImg alt="user image" [src]="userData().imageUrl" class="w-8 h-8 rounded-full" />

      <!-- user data -->
      <div class="flex flex-col">
        <!-- user name -->
        <div class="font-bold flex gap-2 items-center text-base">
          <div [style.color]="userData().color">{{ userData().username }}</div>
          <div
            class="w-3 h-3 rounded-full"
            [ngClass]="{
              'bg-green-500': userData().isActive,
              'bg-red-500': !userData().isActive
            }"
          ></div>
        </div>

        <!-- last message -->
        @if (lastMessage(); as lastMessage) {
          <div class="line-clamp-2 text-gray-800">
            {{ lastMessage.content }}
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  hostDirectives: [
    {
      directive: ClickableDirective,
      inputs: ['clickable'],
      outputs: ['itemClicked'],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemComponent {
  userData = input.required<ApplicationUser>();
  lastMessage = input<MessageStored | undefined>(undefined);
}
