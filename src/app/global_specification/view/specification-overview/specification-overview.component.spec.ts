import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationOverviewComponent } from './specification-overview.component';

describe('SpecificationOverviewComponent', () => {
  let component: SpecificationOverviewComponent;
  let fixture: ComponentFixture<SpecificationOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificationOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
