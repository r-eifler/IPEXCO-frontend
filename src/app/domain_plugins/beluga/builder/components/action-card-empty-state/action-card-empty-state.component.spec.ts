import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCardEmptyStateComponent } from './action-card-empty-state.component';

describe('ActionCardEmptyStateComponent', () => {
  let component: ActionCardEmptyStateComponent;
  let fixture: ComponentFixture<ActionCardEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionCardEmptyStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionCardEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
