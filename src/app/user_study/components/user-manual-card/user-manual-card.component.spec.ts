import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualCardComponent } from './user-manual-card.component';

describe('ToolDescriptionCardComponent', () => {
  let component: UserManualCardComponent;
  let fixture: ComponentFixture<UserManualCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManualCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManualCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
