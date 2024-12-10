import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableListEntryComponent } from './editable-list-entry.component';

describe('EditableListEntryComponent', () => {
  let component: EditableListEntryComponent;
  let fixture: ComponentFixture<EditableListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableListEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
