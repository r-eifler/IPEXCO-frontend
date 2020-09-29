import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLoggerDataComponent } from './time-logger-data.component';

describe('TimeLoggerDataComponent', () => {
  let component: TimeLoggerDataComponent;
  let fixture: ComponentFixture<TimeLoggerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeLoggerDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLoggerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
