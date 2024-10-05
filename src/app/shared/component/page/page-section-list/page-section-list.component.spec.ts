import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSectionListComponent } from './page-section-list.component';

describe('PageSectionListComponent', () => {
  let component: PageSectionListComponent;
  let fixture: ComponentFixture<PageSectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSectionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
