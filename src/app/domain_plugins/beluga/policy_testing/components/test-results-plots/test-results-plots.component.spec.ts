import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultsPlotsComponent } from './test-results-plots.component';

describe('TestResultsPlotsComponent', () => {
  let component: TestResultsPlotsComponent;
  let fixture: ComponentFixture<TestResultsPlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestResultsPlotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestResultsPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
