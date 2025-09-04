import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSuiteHeroComponent } from './test-suite-hero.component';

describe('TestSuiteHeroComponent', () => {
  let component: TestSuiteHeroComponent;
  let fixture: ComponentFixture<TestSuiteHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSuiteHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSuiteHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
