import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetSectionContentComponent } from './side-sheet-section-content.component';

describe('SideSheetSectionContentComponent', () => {
  let component: SideSheetSectionContentComponent;
  let fixture: ComponentFixture<SideSheetSectionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetSectionContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetSectionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
