import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [MockProvider(AuthenticationService)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should AuthenticationService be present', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.authenticationService).toBeTruthy();
  });
});
