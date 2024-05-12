import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApplicationUser } from '@shared-types';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { UserApiService } from '../../api';
import { AuthenticationService } from '../../authentication';
import { DialogServiceUtil } from '../../utils';
import { UsernameValidation } from '../../utils/validation';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const selectorUsernameInput = '[data-testid="login-username-input"]';
  const selectorSubmitButton = '[data-testid="login-submit-button"]';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        MockProvider(AuthenticationService, {
          setAuthenticatedUser: jest.fn(),
        }),
        MockProvider(UserApiService, {
          createUser: jest.fn(),
        }),
        MockProvider(DialogServiceUtil, {
          showNotificationBar: jest.fn(),
        }),
        MockProvider(Router),
        MockProvider(UsernameValidation, {
          validate: jest.fn().mockReturnValue(of(null)),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoading to false', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should mark form as invalid if username is empty', () => {
    const submitButton = fixture.debugElement.query(By.css(selectorSubmitButton));

    const userTouchSpy = jest.spyOn(component.usernameControl, 'markAsTouched');

    expect(submitButton.nativeElement.disabled).toBe(true);
    expect(component.isLoading()).toBe(false);
    expect(userTouchSpy).not.toHaveBeenCalled();
  });

  it('should create user if username is valid', async () => {
    const usernameInput = fixture.debugElement.query(By.css(selectorUsernameInput));
    const submitButton = fixture.debugElement.query(By.css(selectorSubmitButton));

    const userApiService = TestBed.inject(UserApiService);
    const dialogServiceUtil = TestBed.inject(DialogServiceUtil);
    const router = TestBed.inject(Router);
    const authentication = TestBed.inject(AuthenticationService);

    const newMockUser = { userId: '123', username: 'test1234' } as ApplicationUser;
    ngMocks.stub(userApiService, {
      createUser: jest.fn().mockReturnValue(of(newMockUser)),
    });

    // set value into the input
    usernameInput.nativeElement.value = 'test1234';
    usernameInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // click on submit
    submitButton.nativeElement.click();

    expect(userApiService.createUser).toHaveBeenCalledWith('test1234');
    expect(dialogServiceUtil.showNotificationBar).toHaveBeenNthCalledWith(1, 'Creating user...');
    expect(dialogServiceUtil.showNotificationBar).toHaveBeenNthCalledWith(2, 'User created', 'success');
    expect(router.navigate).toHaveBeenCalledWith(['/chat-room']);
    expect(authentication.setAuthenticatedUser).toHaveBeenCalledWith(newMockUser);
    expect(component.isLoading()).toBe(false);
  });
});
