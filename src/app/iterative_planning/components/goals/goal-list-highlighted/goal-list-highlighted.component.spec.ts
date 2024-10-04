import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalListHighlightedComponent } from './goal-list-highlighted.component';

describe('GoalListHighlightedComponent', () => {
  let component: GoalListHighlightedComponent;
  let fixture: ComponentFixture<GoalListHighlightedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalListHighlightedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalListHighlightedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
