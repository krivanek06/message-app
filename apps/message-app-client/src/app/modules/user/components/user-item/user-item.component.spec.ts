import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ApplicationUser, MessageStored } from '@shared-types';
import { UserItemComponent } from './user-item.component';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  const selectorContent = '[data-testid="user-item-content"]';
  const selectorStatus = '[data-testid="user-item-status"]';

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [UserItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserItemComponent);

    // setting default required input
    fixture.componentRef.setInput('userData', {} as ApplicationUser);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message section if message exists', () => {
    const contentEl = fixture.debugElement.query(By.css(selectorContent));

    // check if possible to query element
    expect(contentEl).toBeTruthy();

    // does not exist if no message
    expect(contentEl?.nativeElement?.textContent).toContain('');

    // setup message into component
    const testMessage: MessageStored = {
      content: 'Hello world',
      userId: '123',
      messageId: '456',
      timestamp: Date.now(),
    };

    // set signal input
    fixture.componentRef.setInput('lastMessage', testMessage);

    // detect changes
    fixture.detectChanges();

    // check if message is present
    expect(contentEl?.nativeElement?.textContent).toContain(testMessage.content);
  });

  it('should display status section if user is active', () => {
    const statusEl = fixture.debugElement.query(By.css(selectorStatus));

    // check if possible to query element
    expect(statusEl).toBeTruthy();

    // does not exist if no user data
    expect(statusEl?.nativeElement?.classList).toContain('bg-red-500');

    // setup user data into component
    const testUserActive = {
      userId: '123',
      username: 'test',
      isActive: true,
    } as ApplicationUser;

    // set signal input
    fixture.componentRef.setInput('userData', testUserActive);

    // detect changes
    fixture.detectChanges();

    // check if status is present
    expect(statusEl?.nativeElement?.classList).toContain('bg-green-500');

    // create inactive user
    const testUserInactive = {
      userId: '123',
      username: 'test',
      isActive: false,
    } as ApplicationUser;

    // set signal input
    fixture.componentRef.setInput('userData', testUserInactive);

    // detect changes
    fixture.detectChanges();

    // check if status is present
    expect(statusEl?.nativeElement?.classList).toContain('bg-red-500');
  });
});
