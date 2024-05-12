import { TestBed } from '@angular/core/testing';
import { ApplicationUser } from '@shared-types';
import { ngMocks } from 'ng-mocks';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = ngMocks.findInstance(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have empty user', () => {
    expect(service.authenticatedUser()).toBe(null);
  });

  it('should clear user on logout', () => {
    service.setAuthenticatedUser({} as any);
    service.logout();
    expect(service.authenticatedUser()).toBe(null);
  });

  it('should set user ', () => {
    const mockUser = { userId: '1234' } as ApplicationUser;
    service.setAuthenticatedUser(mockUser);
    expect(service.authenticatedUser()).toEqual(mockUser);
  });
});
