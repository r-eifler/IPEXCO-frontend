import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserStudyCreatorComponent} from './user-study-creator.component';

describe('UserStudyCreatorComponent', () => {
  let component: UserStudyCreatorComponent;
  let fixture: ComponentFixture<UserStudyCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStudyCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
