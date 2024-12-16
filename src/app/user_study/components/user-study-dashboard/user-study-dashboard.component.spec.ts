import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyDashboardComponent } from './user-study-dashboard.component';

describe('UserStudyDashboardComponent', () => {
  let component: UserStudyDashboardComponent;
  let fixture: ComponentFixture<UserStudyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
