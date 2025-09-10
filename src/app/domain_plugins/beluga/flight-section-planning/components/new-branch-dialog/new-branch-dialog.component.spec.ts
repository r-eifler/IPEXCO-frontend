import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBranchDialogComponent } from './new-branch-dialog.component';

describe('NewBranchDialogComponent', () => {
  let component: NewBranchDialogComponent;
  let fixture: ComponentFixture<NewBranchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBranchDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBranchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
