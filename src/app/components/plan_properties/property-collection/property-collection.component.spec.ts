import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PropertyCollectionComponent} from './property-collection.component';

describe('PropertyCollectionComponent', () => {
  let component: PropertyCollectionComponent;
  let fixture: ComponentFixture<PropertyCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
