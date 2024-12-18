import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionExternalViewComponent } from './user-study-execution-external-view.component';

describe('UserStudyExecutionExternalViewComponent', () => {
  let component: UserStudyExecutionExternalViewComponent;
  let fixture: ComponentFixture<UserStudyExecutionExternalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionExternalViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionExternalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
