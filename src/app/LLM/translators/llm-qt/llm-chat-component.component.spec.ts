import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmQtChatComponent } from './llm-chat-component.component';

describe('LlmQtChatComponent', () => {
  let component: LlmQtChatComponent;
  let fixture: ComponentFixture<LlmQtChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlmQtChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlmQtChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
