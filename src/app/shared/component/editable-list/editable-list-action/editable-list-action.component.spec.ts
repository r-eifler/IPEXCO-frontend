import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableListActionComponent } from './editable-list-action.component';

describe('EditableListActionComponent', () => {
  let component: EditableListActionComponent;
  let fixture: ComponentFixture<EditableListActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableListActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableListActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
