import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableListEntrySuffixComponent } from './editable-list-entry-suffix.component';

describe('EditableListEntrySuffixComponent', () => {
  let component: EditableListEntrySuffixComponent;
  let fixture: ComponentFixture<EditableListEntrySuffixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableListEntrySuffixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableListEntrySuffixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
