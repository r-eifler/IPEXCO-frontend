import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTemplateCreatorComponent } from './property-template-creator.component';

describe('PropertyTemplateCreatorComponent', () => {
  let component: PropertyTemplateCreatorComponent;
  let fixture: ComponentFixture<PropertyTemplateCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyTemplateCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyTemplateCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
