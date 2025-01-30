import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptCreatorComponent } from './prompt-creator.component';

describe('PromptCreatorComponent', () => {
  let component: PromptCreatorComponent;
  let fixture: ComponentFixture<PromptCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
