import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTemplatePartComponent } from './property-template-part.component';

describe('PropertyTemplatePartComponent', () => {
  let component: PropertyTemplatePartComponent;
  let fixture: ComponentFixture<PropertyTemplatePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyTemplatePartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyTemplatePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
