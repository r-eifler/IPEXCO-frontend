import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationControlsComponent } from './explanation-controls.component';

describe('ExplanationControlsComponent', () => {
  let component: ExplanationControlsComponent;
  let fixture: ComponentFixture<ExplanationControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplanationControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplanationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
