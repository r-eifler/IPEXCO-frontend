import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionCancelViewComponent } from './user-study-execution-cancel-view.component';

describe('UserStudyExecutionCancelViewComponent', () => {
  let component: UserStudyExecutionCancelViewComponent;
  let fixture: ComponentFixture<UserStudyExecutionCancelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionCancelViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionCancelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
