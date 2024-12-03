import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPropertyPanelComponent } from './plan-property-panel.component';

describe('PlanPropertyPanelComponent', () => {
  let component: PlanPropertyPanelComponent;
  let fixture: ComponentFixture<PlanPropertyPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanPropertyPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanPropertyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
