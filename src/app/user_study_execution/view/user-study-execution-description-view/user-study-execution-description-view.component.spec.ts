import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyExecutionDescriptionViewComponent } from './user-study-execution-description-view.component';

describe('UserStudyExecutionDescriptionViewComponent', () => {
  let component: UserStudyExecutionDescriptionViewComponent;
  let fixture: ComponentFixture<UserStudyExecutionDescriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyExecutionDescriptionViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyExecutionDescriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
