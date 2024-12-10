import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoDetailsViewComponent } from './demo-details-view.component';

describe('DemoDetailsViewComponent', () => {
  let component: DemoDetailsViewComponent;
  let fixture: ComponentFixture<DemoDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoDetailsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
