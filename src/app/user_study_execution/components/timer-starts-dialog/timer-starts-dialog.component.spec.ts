import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerStartsDialogComponent } from './timer-starts-dialog.component';

describe('TimerStartsDialogComponent', () => {
  let component: TimerStartsDialogComponent;
  let fixture: ComponentFixture<TimerStartsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerStartsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerStartsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
