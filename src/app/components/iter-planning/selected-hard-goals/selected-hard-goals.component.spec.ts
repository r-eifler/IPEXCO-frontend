import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedHardGoalsComponent } from './selected-hard-goals.component';

describe('SelectedHardGoalsComponent', () => {
  let component: SelectedHardGoalsComponent;
  let fixture: ComponentFixture<SelectedHardGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedHardGoalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedHardGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
