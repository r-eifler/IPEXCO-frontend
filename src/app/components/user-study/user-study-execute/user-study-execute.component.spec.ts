import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserStudyExecuteComponent} from './user-study-execute.component';

describe('UserStudyExecuterComponent', () => {
  let component: UserStudyExecuteComponent;
  let fixture: ComponentFixture<UserStudyExecuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStudyExecuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyExecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
