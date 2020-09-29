import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyDataBaseComponent } from './user-study-data-base.component';

describe('UserStudyDataBaseComponent', () => {
  let component: UserStudyDataBaseComponent;
  let fixture: ComponentFixture<UserStudyDataBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserStudyDataBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyDataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
