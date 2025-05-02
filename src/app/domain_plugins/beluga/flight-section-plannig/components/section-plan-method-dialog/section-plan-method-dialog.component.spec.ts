import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionPlanMethodDialogComponent } from './section-plan-method-dialog.component';

describe('SectionPlanMethodDialogComponent', () => {
  let component: SectionPlanMethodDialogComponent;
  let fixture: ComponentFixture<SectionPlanMethodDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionPlanMethodDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionPlanMethodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
