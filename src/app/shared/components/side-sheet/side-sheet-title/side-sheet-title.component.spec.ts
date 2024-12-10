import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetTitleComponent } from './side-sheet-title.component';

describe('SideSheetTitleComponent', () => {
  let component: SideSheetTitleComponent;
  let fixture: ComponentFixture<SideSheetTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
