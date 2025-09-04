import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCollectionCardComponent } from './test-collection-card.component';

describe('TestCollectionCardComponent', () => {
  let component: TestCollectionCardComponent;
  let fixture: ComponentFixture<TestCollectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCollectionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCollectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
