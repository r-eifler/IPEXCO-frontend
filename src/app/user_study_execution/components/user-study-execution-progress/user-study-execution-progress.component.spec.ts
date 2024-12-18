import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionProgressComponent } from './user-study-execution-progress.component';

describe('UserStudyExecutionProgressComponent', () => {
  let component: UserStudyExecutionProgressComponent;
  let fixture: ComponentFixture<UserStudyExecutionProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
