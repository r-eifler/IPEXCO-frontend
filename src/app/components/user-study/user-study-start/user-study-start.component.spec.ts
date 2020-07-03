import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyStartComponent } from './user-study-start.component';

describe('UserStudyStartComponent', () => {
  let component: UserStudyStartComponent;
  let fixture: ComponentFixture<UserStudyStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStudyStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
