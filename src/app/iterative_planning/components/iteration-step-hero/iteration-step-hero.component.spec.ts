import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IterationStepHeroComponent } from './iteration-step-hero.component';

describe('IterationStepHeroComponent', () => {
  let component: IterationStepHeroComponent;
  let fixture: ComponentFixture<IterationStepHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IterationStepHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IterationStepHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
