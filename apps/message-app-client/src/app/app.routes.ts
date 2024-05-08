import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'chat-room',
    loadComponent: () => import('./pages/chat-room/chat-room.component').then((m) => m.ChatRoomComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
