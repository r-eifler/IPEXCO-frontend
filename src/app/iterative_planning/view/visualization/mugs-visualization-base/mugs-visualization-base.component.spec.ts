import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MugsVisualizationBaseComponent } from './mugs-visualization-base.component';

describe('MugsVisualizationBaseComponent', () => {
  let component: MugsVisualizationBaseComponent;
  let fixture: ComponentFixture<MugsVisualizationBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MugsVisualizationBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MugsVisualizationBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
