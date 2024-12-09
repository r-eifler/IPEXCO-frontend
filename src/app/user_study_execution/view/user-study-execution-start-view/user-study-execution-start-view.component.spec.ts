import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionStartViewComponent } from './user-study-execution-start-view.component';

describe('UserStudyExecutionStartViewComponent', () => {
  let component: UserStudyExecutionStartViewComponent;
  let fixture: ComponentFixture<UserStudyExecutionStartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionStartViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionStartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
