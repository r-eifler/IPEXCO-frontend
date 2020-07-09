import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserStudySelectionComponent} from './user-study-selection.component';

describe('UserStudySelectionComponent', () => {
  let component: UserStudySelectionComponent;
  let fixture: ComponentFixture<UserStudySelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStudySelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
