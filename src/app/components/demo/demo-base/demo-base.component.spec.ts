import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DemoBaseComponent} from './demo-base.component';

describe('DemoBaseComponent', () => {
  let component: DemoBaseComponent;
  let fixture: ComponentFixture<DemoBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
