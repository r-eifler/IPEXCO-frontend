import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserStudyFormViewComponent} from './user-study-form-view.component';

describe('UserStudyFormViewComponent', () => {
  let component: UserStudyFormViewComponent;
  let fixture: ComponentFixture<UserStudyFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStudyFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
