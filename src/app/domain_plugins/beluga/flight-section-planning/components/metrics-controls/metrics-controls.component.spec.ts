import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsControlsComponent } from './metrics-controls.component';

describe('MetricsControlsComponent', () => {
  let component: MetricsControlsComponent;
  let fixture: ComponentFixture<MetricsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
