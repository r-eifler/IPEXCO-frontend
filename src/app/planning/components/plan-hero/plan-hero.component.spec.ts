import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanHeroComponent } from './plan-hero.component';

describe('PlanHeroComponent', () => {
  let component: PlanHeroComponent;
  let fixture: ComponentFixture<PlanHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
