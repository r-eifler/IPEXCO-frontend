import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyTestingShellComponent } from './policy-testing-shell.component';

describe('ShellComponent', () => {
  let component: PolicyTestingShellComponent;
  let fixture: ComponentFixture<PolicyTestingShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyTestingShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyTestingShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
