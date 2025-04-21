import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateGridComponent } from './state-grid.component';

describe('StateGridComponent', () => {
  let component: StateGridComponent;
  let fixture: ComponentFixture<StateGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
