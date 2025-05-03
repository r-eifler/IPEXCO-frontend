import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanInspectorComponent } from './plan-inspector.component';

describe('PlanInspectorComponent', () => {
  let component: PlanInspectorComponent;
  let fixture: ComponentFixture<PlanInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanInspectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
