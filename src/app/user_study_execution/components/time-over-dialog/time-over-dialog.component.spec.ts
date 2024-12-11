import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOverDialogComponent } from './time-over-dialog.component';

describe('TimeOverDialogComponent', () => {
  let component: TimeOverDialogComponent;
  let fixture: ComponentFixture<TimeOverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeOverDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeOverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
