import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBarComponent } from './payment-bar.component';

describe('PaymentBarComponent', () => {
  let component: PaymentBarComponent;
  let fixture: ComponentFixture<PaymentBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
