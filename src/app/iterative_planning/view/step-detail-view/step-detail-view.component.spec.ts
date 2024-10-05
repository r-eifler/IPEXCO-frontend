import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDetailViewComponent } from './step-detail-view.component';

describe('StepDetailViewComponent', () => {
  let component: StepDetailViewComponent;
  let fixture: ComponentFixture<StepDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepDetailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
