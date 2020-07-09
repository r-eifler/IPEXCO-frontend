import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DemoTaskIntroComponent} from './demo-task-intro.component';

describe('DemoTaskIntroComponent', () => {
  let component: DemoTaskIntroComponent;
  let fixture: ComponentFixture<DemoTaskIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoTaskIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTaskIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
