import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoCardRunningComponent } from './demo-card-running.component';

describe('DemoCardRunnigComponent', () => {
  let component: DemoCardRunningComponent;
  let fixture: ComponentFixture<DemoCardRunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoCardRunningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoCardRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
