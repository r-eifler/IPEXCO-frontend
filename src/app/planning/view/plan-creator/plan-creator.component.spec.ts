import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCreatorComponent } from './plan-creator.component';

describe('PlanCreatorComponent', () => {
  let component: PlanCreatorComponent;
  let fixture: ComponentFixture<PlanCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
