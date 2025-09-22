import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPolicyTraceComponent } from './error-policy-trace.component';

describe('ErrorPolicyTraceComponent', () => {
  let component: ErrorPolicyTraceComponent;
  let fixture: ComponentFixture<ErrorPolicyTraceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorPolicyTraceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorPolicyTraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
