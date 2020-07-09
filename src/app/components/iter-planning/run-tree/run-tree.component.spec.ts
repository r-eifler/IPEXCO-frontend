import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RunTreeComponent} from './run-tree.component';

describe('RunTreeComponent', () => {
  let component: RunTreeComponent;
  let fixture: ComponentFixture<RunTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
