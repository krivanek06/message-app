import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { ChatFeatureComponent } from './chat-feature.component';

describe('ChatFeatureComponent', () => {
  let component: ChatFeatureComponent;
  let fixture: ComponentFixture<ChatFeatureComponent>;

  beforeEach(async () => {
    MockBuilder(ChatFeatureComponent);

    fixture = MockRender(ChatFeatureComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
