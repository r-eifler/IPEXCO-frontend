import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTemplateNumericPartComponent } from './property-template-numeric-part.component';

describe('PropertyTemplateNumericPartComponent', () => {
  let component: PropertyTemplateNumericPartComponent;
  let fixture: ComponentFixture<PropertyTemplateNumericPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyTemplateNumericPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyTemplateNumericPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
