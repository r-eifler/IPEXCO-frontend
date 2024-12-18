import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionHandlerComponent } from './user-study-execution-handler.component';

describe('UserStudyExecutionTimerComponent', () => {
  let component: UserStudyExecutionHandlerComponent;
  let fixture: ComponentFixture<UserStudyExecutionHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionHandlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
