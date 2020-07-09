import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DemoFinishedComponent} from './demo-finished.component';

describe('DemoFinishedComponent', () => {
  let component: DemoFinishedComponent;
  let fixture: ComponentFixture<DemoFinishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoFinishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
