import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmBaseComponent } from './llm-base.component';

describe('LlmBaseComponent', () => {
  let component: LlmBaseComponent;
  let fixture: ComponentFixture<LlmBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlmBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlmBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
