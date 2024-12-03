import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetSectionComponent } from './side-sheet-section.component';

describe('SideSheetSectionComponent', () => {
  let component: SideSheetSectionComponent;
  let fixture: ComponentFixture<SideSheetSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
