import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DemoHelpComponent} from './demo-help.component';

describe('DemoHelpComponent', () => {
  let component: DemoHelpComponent;
  let fixture: ComponentFixture<DemoHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
