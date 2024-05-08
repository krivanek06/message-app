import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: ` <h1 class="text-3xl font-bold underline text-red-300 bg-blue-300">Hello world!</h1> `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class LoginComponent {}
