import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoNavigatorComponent } from './demo-navigator.component';

describe('DemoNavigatorComponent', () => {
  let component: DemoNavigatorComponent;
  let fixture: ComponentFixture<DemoNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
