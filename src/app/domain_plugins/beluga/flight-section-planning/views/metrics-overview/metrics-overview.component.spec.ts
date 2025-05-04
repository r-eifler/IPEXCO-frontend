import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsOverviewComponent } from './metrics-overview.component';

describe('MetricsOverviewComponent', () => {
  let component: MetricsOverviewComponent;
  let fixture: ComponentFixture<MetricsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
