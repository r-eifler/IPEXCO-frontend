import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmGtChatComponent } from './llm-chat-component.component';

describe('LlmGtChatComponent', () => {
  let component: LlmGtChatComponent;
  let fixture: ComponentFixture<LlmGtChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlmGtChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlmGtChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
