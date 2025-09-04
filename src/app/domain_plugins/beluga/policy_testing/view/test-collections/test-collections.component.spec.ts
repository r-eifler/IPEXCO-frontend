import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCollectionsComponent } from './test-collections.component';

describe('TestCollectionsComponent', () => {
  let component: TestCollectionsComponent;
  let fixture: ComponentFixture<TestCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
