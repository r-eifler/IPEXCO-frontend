import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalExplanationComponent } from './global-explanation.component';

describe('GlobalExplanationComponent', () => {
  let component: GlobalExplanationComponent;
  let fixture: ComponentFixture<GlobalExplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalExplanationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
