import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ApplicationUserSearch } from '@shared-types';
import { MockProvider, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { UserApiService } from '../../../../api';
import { UserSearchComponent } from './user-search.component';

describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;

  const selectorSearchInput = '[data-testid="user-search-input"]';
  const selectorSelectedUser = '[data-testid="user-search-user-selected"]';
  const selectedSearchedUsers = '[data-testid="user-search-user-item"]';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchComponent, ReactiveFormsModule],
      providers: [MockProvider(UserApiService)],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display search input', () => {
    const searchInput = fixture.debugElement.query(By.css(selectorSearchInput));

    expect(searchInput).toBeTruthy();
  });

  it('should have searchedUsers empty by default', () => {
    expect(component.searchedUsers()).toEqual([]);
  });

  it('should have searchUserControl defined', () => {
    expect(component.searchUserControl).toBeDefined();
  });

  it('should query active users when input is empty', async () => {
    const mockActiveUsers = [{ userId: '123' }] as ApplicationUserSearch[];

    const userApiService = TestBed.inject(UserApiService);
    ngMocks.stub(userApiService, {
      getLastActiveUsers: jest.fn().mockReturnValue(of(mockActiveUsers)),
    });

    fixture.detectChanges();

    // wait for the debounce time
    await fixture.whenStable();

    expect(userApiService.getLastActiveUsers).toHaveBeenCalled();
    expect(component.searchedUsers()[0].userId).toEqual(mockActiveUsers[0].userId);
    expect(component.searchedUsers()).toEqual(mockActiveUsers);
  });

  it('should query users from server when typing into input', async () => {
    const userApiService = TestBed.inject(UserApiService);
    const searchInput = fixture.debugElement.query(By.css(selectorSearchInput));
    const searchInputEl = searchInput.nativeElement as HTMLInputElement;

    // add value to the input
    searchInputEl.value = 'test';
    searchInputEl.dispatchEvent(new Event('input'));

    // mock data
    const mockUsers = [{ userId: '123' }] as ApplicationUserSearch[];

    ngMocks.stub(userApiService, {
      getUsersByUsername: jest.fn().mockReturnValue(of(mockUsers)),
    });

    // wait for the debounce time
    await fixture.whenStable();

    expect(userApiService.getUsersByUsername).toHaveBeenCalledWith('test');
    expect(component.searchedUsers()).toEqual(mockUsers);
  });

  it('should display searched users & allow clicking', async () => {
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const mockUsers = [
      { userId: '123', username: 'test1' },
      { userId: '124', username: 'test2' },
    ] as ApplicationUserSearch[];

    // mock loading users
    const userApiService = TestBed.inject(UserApiService);
    ngMocks.stub(userApiService, {
      getLastActiveUsers: jest.fn().mockReturnValue(of(mockUsers)),
    });

    // wait for the debounce time
    await fixture.whenStable();

    fixture.detectChanges();

    // check if users are displayed
    const userItems = fixture.debugElement.queryAll(By.css(selectedSearchedUsers));

    expect(userItems.length).toEqual(mockUsers.length);

    // click on first user
    userItems[0].nativeElement.click();

    // check if onChange was triggered
    expect(component.selectedUser()).toEqual(mockUsers[0]);
    expect(onChangeSpy).toHaveBeenCalledWith(mockUsers[0]);
    expect(component.searchUserControl.enabled).toBeFalsy();

    fixture.detectChanges();

    // check if user is selected
    const selectedUser = fixture.debugElement.query(By.css(selectorSelectedUser));

    expect(selectedUser).toBeTruthy();
  });

  it('should deselect when user is already selected', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const mockUser = { userId: '123', username: 'test1' } as ApplicationUserSearch;

    // set selected user
    component.selectedUser.set(mockUser);

    fixture.detectChanges();

    // click on user
    component.onUserClick(null);

    expect(component.selectedUser()).toBeNull();
    expect(onChangeSpy).toHaveBeenCalledWith(null);
    expect(component.searchUserControl.enabled).toBeTruthy();
    expect(component.searchUserControl.value).toEqual('');
  });
});
