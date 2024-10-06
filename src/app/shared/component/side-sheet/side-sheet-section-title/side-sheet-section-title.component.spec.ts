import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetSectionTitleComponent } from './side-sheet-section-title.component';

describe('SideSheetSectionTitleComponent', () => {
  let component: SideSheetSectionTitleComponent;
  let fixture: ComponentFixture<SideSheetSectionTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetSectionTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetSectionTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
