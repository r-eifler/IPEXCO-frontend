import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCreatorComponent } from './property-creator.component';

describe('PropertyCreatorComponent', () => {
  let component: PropertyCreatorComponent;
  let fixture: ComponentFixture<PropertyCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
