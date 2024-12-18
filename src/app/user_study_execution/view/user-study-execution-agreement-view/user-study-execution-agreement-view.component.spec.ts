import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionAgreementViewComponent } from './user-study-execution-agreement-view.component';

describe('UserStudyExecutionAgreementViewComponent', () => {
  let component: UserStudyExecutionAgreementViewComponent;
  let fixture: ComponentFixture<UserStudyExecutionAgreementViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionAgreementViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionAgreementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
