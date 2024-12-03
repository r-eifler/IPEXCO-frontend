import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTypingComponent } from './chat-typing.component';

describe('ChatTypingComponent', () => {
  let component: ChatTypingComponent;
  let fixture: ComponentFixture<ChatTypingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTypingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatTypingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
