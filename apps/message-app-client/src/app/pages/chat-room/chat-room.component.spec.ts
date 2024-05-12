import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationUser } from '@shared-types';
import { MockComponent, MockProvider, ngMocks } from 'ng-mocks';
import { AuthenticationService } from '../../authentication';
import { ChatFeatureComponent } from '../../modules/chat';
import { UserSearchComponent } from '../../modules/user/features';
import { ChatRoomComponent } from './chat-room.component';

describe('ChatRoomComponent', () => {
  let fixture: ComponentFixture<ChatRoomComponent>;

  let routerMock: Router;
  let authenticationServiceMock: AuthenticationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChatRoomComponent,
        ReactiveFormsModule,
        MockComponent(ChatFeatureComponent),
        MockComponent(UserSearchComponent),
      ],
      providers: [
        MockProvider(Router),
        MockProvider(AuthenticationService, {
          authenticatedUserData: signal({} as ApplicationUser),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatRoomComponent);

    routerMock = ngMocks.get(Router);
    authenticationServiceMock = ngMocks.get(AuthenticationService);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture).toBeDefined();
  });

  it('should log out on onLogout()', async () => {
    await fixture.componentInstance.onLogout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    expect(authenticationServiceMock.logout).toHaveBeenCalled();
  });
});
