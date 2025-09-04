import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTestCaseComponent } from './new-test-case.component';

describe('NewTestCaseComponent', () => {
  let component: NewTestCaseComponent;
  let fixture: ComponentFixture<NewTestCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTestCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
