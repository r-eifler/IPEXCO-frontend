import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualRunUserDataComponent } from './individual-run-user-data.component';

describe('IndividualRunUserDataComponent', () => {
  let component: IndividualRunUserDataComponent;
  let fixture: ComponentFixture<IndividualRunUserDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualRunUserDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualRunUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
