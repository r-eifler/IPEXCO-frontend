import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetFooterComponent } from './side-sheet-footer.component';

describe('SideSheetFooterComponent', () => {
  let component: SideSheetFooterComponent;
  let fixture: ComponentFixture<SideSheetFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
