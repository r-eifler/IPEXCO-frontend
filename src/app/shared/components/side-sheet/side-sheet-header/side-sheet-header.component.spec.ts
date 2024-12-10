import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetHeaderComponent } from './side-sheet-header.component';

describe('SideSheetHeaderComponent', () => {
  let component: SideSheetHeaderComponent;
  let fixture: ComponentFixture<SideSheetHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
