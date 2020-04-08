import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePlanPropertyComponent } from './template-plan-property.component';

describe('TemplatePlanPropertyComponent', () => {
  let component: TemplatePlanPropertyComponent;
  let fixture: ComponentFixture<TemplatePlanPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePlanPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePlanPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
