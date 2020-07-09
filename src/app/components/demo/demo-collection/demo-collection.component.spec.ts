import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DemoSellectionComponent} from './demo-collection.component';

describe('DemoSellectionComponent', () => {
  let component: DemoSellectionComponent;
  let fixture: ComponentFixture<DemoSellectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoSellectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoSellectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
