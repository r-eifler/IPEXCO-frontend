import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoEditViewComponent } from './demo-edit-view.component';

describe('DemoEditViewComponent', () => {
  let component: DemoEditViewComponent;
  let fixture: ComponentFixture<DemoEditViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoEditViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
