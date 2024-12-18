import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionFinishViewComponent } from './user-study-execution-finish-view.component';

describe('UserStudyExecutionFinishViewComponent', () => {
  let component: UserStudyExecutionFinishViewComponent;
  let fixture: ComponentFixture<UserStudyExecutionFinishViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionFinishViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionFinishViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
