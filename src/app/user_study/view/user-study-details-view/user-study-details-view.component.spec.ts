import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyDetailsViewComponent } from './user-study-details-view.component';

describe('UserStudyDetailsViewComponent', () => {
  let component: UserStudyDetailsViewComponent;
  let fixture: ComponentFixture<UserStudyDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyDetailsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
