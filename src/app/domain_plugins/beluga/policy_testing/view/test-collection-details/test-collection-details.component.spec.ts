import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCollectionDetailsComponent } from './test-collection-details.component';

describe('TestCollectionDetailsComponent', () => {
  let component: TestCollectionDetailsComponent;
  let fixture: ComponentFixture<TestCollectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCollectionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCollectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
