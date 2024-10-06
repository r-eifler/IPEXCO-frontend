import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSectionTitleComponent } from './page-section-title.component';

describe('PageSectionTitleComponent', () => {
  let component: PageSectionTitleComponent;
  let fixture: ComponentFixture<PageSectionTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSectionTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSectionTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
