import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualViewComponent } from './user-manual-view.component';

describe('UserManualViewComponent', () => {
  let component: UserManualViewComponent;
  let fixture: ComponentFixture<UserManualViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManualViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManualViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
