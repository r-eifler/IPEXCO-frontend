import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecCardFeatureComponent } from './spec-card-feature.component';

describe('SpecCardFeatureComponent', () => {
  let component: SpecCardFeatureComponent;
  let fixture: ComponentFixture<SpecCardFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecCardFeatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecCardFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
