import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTestCollectionDialogComponent } from './new-test-collection-dialog.component';

describe('NewTestCollectionDialogComponent', () => {
  let component: NewTestCollectionDialogComponent;
  let fixture: ComponentFixture<NewTestCollectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTestCollectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTestCollectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
