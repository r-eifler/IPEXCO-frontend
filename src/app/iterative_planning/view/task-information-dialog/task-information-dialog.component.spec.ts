import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskInformationDialogComponent } from './task-information-dialog.component';

describe('TaskInformationViewComponent', () => {
  let component: TaskInformationDialogComponent;
  let fixture: ComponentFixture<TaskInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskInformationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
