import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePddlFileComponent } from './template-pddl-file.component';

describe('TemplatePddlFileComponent', () => {
  let component: TemplatePddlFileComponent;
  let fixture: ComponentFixture<TemplatePddlFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePddlFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePddlFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
