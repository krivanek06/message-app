import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthenticationService } from './authentication';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'chat-room',
    loadComponent: () => import('./pages/chat-room/chat-room.component').then((m) => m.ChatRoomComponent),
    canActivate: [
      () => {
        const authService = inject(AuthenticationService);
        const router = inject(Router);

        if (authService.authenticatedUser()) {
          return true;
        }
        return router.createUrlTree(['/']);
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
