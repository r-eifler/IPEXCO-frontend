import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionDemoViewComponent } from './user-study-execution-demo-view.component';

describe('UserStudyExecutionDemoViewComponent', () => {
  let component: UserStudyExecutionDemoViewComponent;
  let fixture: ComponentFixture<UserStudyExecutionDemoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionDemoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionDemoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
