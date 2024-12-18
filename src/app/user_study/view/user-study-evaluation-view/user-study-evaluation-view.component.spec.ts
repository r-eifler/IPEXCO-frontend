import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyEvaluationViewComponent } from './user-study-evaluation-view.component';

describe('UserStudyEvaluationViewComponent', () => {
  let component: UserStudyEvaluationViewComponent;
  let fixture: ComponentFixture<UserStudyEvaluationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyEvaluationViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyEvaluationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
