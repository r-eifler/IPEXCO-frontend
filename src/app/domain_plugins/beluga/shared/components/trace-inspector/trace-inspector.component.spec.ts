import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceInspectorComponent } from './trace-inspector.component';

describe('TraceInspectorComponent', () => {
  let component: TraceInspectorComponent;
  let fixture: ComponentFixture<TraceInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraceInspectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraceInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
