import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionStepShellComponent } from './user-study-execution-step-shell.component';

describe('UserStutyExecutionStepShellComponent', () => {
  let component: UserStudyExecutionStepShellComponent;
  let fixture: ComponentFixture<UserStudyExecutionStepShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionStepShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionStepShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
