import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePropertyDependencyComponent } from './template-property-dependency.component';

describe('TemplatePropertyDependencyComponent', () => {
  let component: TemplatePropertyDependencyComponent;
  let fixture: ComponentFixture<TemplatePropertyDependencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePropertyDependencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePropertyDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
