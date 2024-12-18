import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyCardComponent } from './user-study-card.component';

describe('UserStudyCardComponent', () => {
  let component: UserStudyCardComponent;
  let fixture: ComponentFixture<UserStudyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
