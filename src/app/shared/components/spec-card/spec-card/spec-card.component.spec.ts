import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecCardComponent } from './spec-card.component';

describe('SpecCardComponent', () => {
  let component: SpecCardComponent;
  let fixture: ComponentFixture<SpecCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
