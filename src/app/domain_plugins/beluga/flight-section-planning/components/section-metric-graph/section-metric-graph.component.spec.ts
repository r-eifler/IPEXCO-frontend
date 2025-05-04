import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionMetricGraphComponent } from './section-metric-graph.component';

describe('SectionMetricGraphComponent', () => {
  let component: SectionMetricGraphComponent;
  let fixture: ComponentFixture<SectionMetricGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionMetricGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionMetricGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
