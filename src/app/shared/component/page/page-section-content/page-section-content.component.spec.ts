import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSectionContentComponent } from './page-section-content.component';

describe('PageSectionContentComponent', () => {
  let component: PageSectionContentComponent;
  let fixture: ComponentFixture<PageSectionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSectionContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSectionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
