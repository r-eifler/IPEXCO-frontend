import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualDialogComponent } from './user-manual-dialog.component';

describe('UserManualDialogueComponent', () => {
  let component: UserManualDialogComponent;
  let fixture: ComponentFixture<UserManualDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManualDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManualDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
