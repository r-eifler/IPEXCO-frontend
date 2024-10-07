import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCreationTemplateBasedComponent } from './property-creation-template-based.component';

describe('PropertyCreationTemplateBasedComponent', () => {
  let component: PropertyCreationTemplateBasedComponent;
  let fixture: ComponentFixture<PropertyCreationTemplateBasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCreationTemplateBasedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyCreationTemplateBasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
