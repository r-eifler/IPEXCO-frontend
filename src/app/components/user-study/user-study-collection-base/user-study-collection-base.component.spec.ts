import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyCollectionBaseComponent } from './user-study-collection-base.component';

describe('UserStudyCollectionBaseComponent', () => {
  let component: UserStudyCollectionBaseComponent;
  let fixture: ComponentFixture<UserStudyCollectionBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserStudyCollectionBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudyCollectionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
