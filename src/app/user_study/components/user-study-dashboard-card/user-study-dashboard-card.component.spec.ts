import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyDashbordCardComponent } from './user-study-dashboard-card.component';

describe('UserStudyDashbordCardComponent', () => {
  let component: UserStudyDashbordCardComponent;
  let fixture: ComponentFixture<UserStudyDashbordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyDashbordCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyDashbordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
