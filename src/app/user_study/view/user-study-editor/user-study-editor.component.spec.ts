import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyEditorComponent } from './user-study-editor.component';

describe('UserStudyEditorComponent', () => {
  let component: UserStudyEditorComponent;
  let fixture: ComponentFixture<UserStudyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
