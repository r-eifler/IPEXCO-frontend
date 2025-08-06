import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsUtilityHeroComponent } from './steps-utility-hero.component';

describe('StepsUtilityHeroComponent', () => {
  let component: StepsUtilityHeroComponent;
  let fixture: ComponentFixture<StepsUtilityHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepsUtilityHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepsUtilityHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
