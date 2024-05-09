import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthenticationService } from '../../authentication';
import { ChatFeatureComponent } from '../../modules/chat';
import { UserItemComponent } from '../../modules/user';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, UserItemComponent, ChatFeatureComponent],
  template: `
    <section class="grid grid-cols-3 h-screen">
      <!-- users -->
      <div class="p-4 bg-gray-500 pt-10 xl:pt-[100px]">
        <app-user-item [userData]="authUser()" />
      </div>

      <!-- chat -->
      <div class="w-full h-[960px] col-span-2 px-10 pt-6">
        <app-chat-feature class="h-full" />
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatRoomComponent {
  private authenticationService = inject(AuthenticationService);

  authUser = this.authenticationService.authenticatedUserData;
}