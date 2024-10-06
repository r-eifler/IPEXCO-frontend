import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetSectionListComponent } from './side-sheet-section-list.component';

describe('SideSheetSectionListComponent', () => {
  let component: SideSheetSectionListComponent;
  let fixture: ComponentFixture<SideSheetSectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetSectionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
