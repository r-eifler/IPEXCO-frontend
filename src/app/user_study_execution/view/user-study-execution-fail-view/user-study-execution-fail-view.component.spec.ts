import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionFailViewComponent } from './user-study-execution-fail-view.component';

describe('UserStutyExecutionFailViewComponent', () => {
  let component: UserStudyExecutionFailViewComponent;
  let fixture: ComponentFixture<UserStudyExecutionFailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionFailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionFailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
