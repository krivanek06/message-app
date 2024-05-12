import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from './authentication';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: ` <router-outlet></router-outlet> `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AppComponent {
  // injected service to inicialize - load data from local storage
  authenticationService = inject(AuthenticationService);
}
