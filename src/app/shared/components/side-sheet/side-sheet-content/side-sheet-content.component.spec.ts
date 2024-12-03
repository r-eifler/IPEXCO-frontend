import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetContentComponent } from './side-sheet-content.component';

describe('SideSheetContentComponent', () => {
  let component: SideSheetContentComponent;
  let fixture: ComponentFixture<SideSheetContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSheetContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSheetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
