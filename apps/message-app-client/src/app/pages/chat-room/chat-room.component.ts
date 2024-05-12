import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ApplicationUser } from '@shared-types';
import { AuthenticationService } from '../../authentication';
import { ChatFeatureComponent } from '../../modules/chat';
import { UserSearchComponent } from '../../modules/user/features';
import { DefaultImgDirective } from '../../utils';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    ChatFeatureComponent,
    UserSearchComponent,
    DefaultImgDirective,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  template: `
    <section class="grid grid-cols-3 h-screen">
      <!-- users -->
      <div class="bg-gray-700 pt-10 xl:pt-[100px] pl-6 pr-10">
        <!-- users data & logout -->
        <div class="p-3 flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <img appDefaultImg [src]="authUser().imageUrl" class="w-10 h-10 rounded-full" />
            <span class="text-lg text-gray-200">{{ authUser().username }}</span>
          </div>
          <button mat-icon-button type="button" (click)="onLogout()">
            <mat-icon class="text-sky-500">logout</mat-icon>
          </button>
        </div>

        <!-- user search -->
        <app-user-search [formControl]="searchedUserControl" />
      </div>

      <!-- chat -->
      <div class="w-full h-[960px] col-span-2 px-10 pt-6">
        <app-chat-feature class="h-full" [specificUserSelected]="searchedUserControl.value" />
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
  private router = inject(Router);

  authUser = this.authenticationService.authenticatedUserData;

  searchedUserControl = new FormControl<ApplicationUser | null>(null);

  async onLogout() {
    // wait to log out before clearing data
    await this.router.navigate(['/']);
    // clear data
    this.authenticationService.logout();
  }
}
