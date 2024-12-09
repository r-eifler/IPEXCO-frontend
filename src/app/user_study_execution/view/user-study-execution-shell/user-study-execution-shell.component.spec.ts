import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionShellComponent } from './user-study-execution-shell.component';

describe('ShellComponent', () => {
  let component: UserStudyExecutionShellComponent;
  let fixture: ComponentFixture<UserStudyExecutionShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
