import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableListEntryPrefixComponent } from './editable-list-entry-prefix.component';

describe('EditableListEntryPrefixComponent', () => {
  let component: EditableListEntryPrefixComponent;
  let fixture: ComponentFixture<EditableListEntryPrefixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableListEntryPrefixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableListEntryPrefixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
