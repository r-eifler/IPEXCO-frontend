import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableListEmptyStateComponent } from './editable-list-empty-state.component';

describe('EditableListEmptyStateComponent', () => {
  let component: EditableListEmptyStateComponent;
  let fixture: ComponentFixture<EditableListEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableListEmptyStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableListEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
