import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationChatLlmComponent } from './explanation-chat-llm.component';

describe('ExplanationChatLlmComponent', () => {
  let component: ExplanationChatLlmComponent;
  let fixture: ComponentFixture<ExplanationChatLlmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplanationChatLlmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplanationChatLlmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
