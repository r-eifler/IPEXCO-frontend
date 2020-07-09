import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserStudyExecuterComponent} from './user-study-executer.component';

describe('UserStudyExecuterComponent', () => {
  let component: UserStudyExecuterComponent;
  let fixture: ComponentFixture<UserStudyExecuterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStudyExecuterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyExecuterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
