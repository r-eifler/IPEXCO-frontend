import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishDemoInfoDialogComponent } from './finish-demo-info-dialog.component';

describe('FinishDemoInfoDialogComponent', () => {
  let component: FinishDemoInfoDialogComponent;
  let fixture: ComponentFixture<FinishDemoInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishDemoInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishDemoInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
