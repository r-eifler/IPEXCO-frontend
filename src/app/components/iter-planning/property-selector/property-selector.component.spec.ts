import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePropertySelectorComponent } from './template-property-selector.component';

describe('TemplatePropertySelecterComponent', () => {
  let component: TemplatePropertySelectorComponent;
  let fixture: ComponentFixture<TemplatePropertySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePropertySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePropertySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
