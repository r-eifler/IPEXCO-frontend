import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NomysteryTaskViewComponent} from './nomystery-task-view.component';

describe('NomysteryTaskViewComponent', () => {
  let component: NomysteryTaskViewComponent;
  let fixture: ComponentFixture<NomysteryTaskViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NomysteryTaskViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NomysteryTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
