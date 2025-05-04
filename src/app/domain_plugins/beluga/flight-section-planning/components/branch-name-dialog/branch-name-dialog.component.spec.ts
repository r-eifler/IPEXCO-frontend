import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchNameDialogComponent } from './branch-name-dialog.component';

describe('BranchNameDialogComponent', () => {
  let component: BranchNameDialogComponent;
  let fixture: ComponentFixture<BranchNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchNameDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
