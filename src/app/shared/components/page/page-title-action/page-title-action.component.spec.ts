import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTitleActionComponent } from './page-title-action.component';

describe('PageTitleActionComponent', () => {
  let component: PageTitleActionComponent;
  let fixture: ComponentFixture<PageTitleActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTitleActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageTitleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
