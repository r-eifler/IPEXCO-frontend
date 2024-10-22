import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmEtChatComponent } from './llm-chat-component.component';

describe('LlmEtChatComponent', () => {
  let component: LlmEtChatComponent;
  let fixture: ComponentFixture<LlmEtChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlmEtChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlmEtChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
