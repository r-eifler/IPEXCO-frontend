import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionTimerComponent } from './user-study-execution-timer.component';

describe('UserStudyExecutionTimerComponent', () => {
  let component: UserStudyExecutionTimerComponent;
  let fixture: ComponentFixture<UserStudyExecutionTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
