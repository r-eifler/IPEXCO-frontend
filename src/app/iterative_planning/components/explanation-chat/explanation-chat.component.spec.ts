import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationChatComponent } from './explanation-chat.component';

describe('ExplanationChatComponent', () => {
  let component: ExplanationChatComponent;
  let fixture: ComponentFixture<ExplanationChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplanationChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplanationChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
