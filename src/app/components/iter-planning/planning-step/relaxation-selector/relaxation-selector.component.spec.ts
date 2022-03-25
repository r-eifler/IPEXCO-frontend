import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaxationSelectorComponent } from './relaxation-selector.component';

describe('RelaxationSelectorComponent', () => {
  let component: RelaxationSelectorComponent;
  let fixture: ComponentFixture<RelaxationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelaxationSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelaxationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
