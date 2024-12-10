import { NgModule } from '@angular/core';

import { EditableListActionComponent } from './editable-list-action/editable-list-action.component';
import { EditableListEmptyStateComponent } from './editable-list-empty-state/editable-list-empty-state.component';
import { EditableListEntryPrefixComponent } from './editable-list-entry-prefix/editable-list-entry-prefix.component';
import { EditableListEntrySuffixComponent } from './editable-list-entry-suffix/editable-list-entry-suffix.component';
import { EditableListEntryComponent } from './editable-list-entry/editable-list-entry.component';
import { EditableListComponent } from './editable-list/editable-list.component';



@NgModule({
  imports: [
    EditableListActionComponent,
    EditableListComponent,
    EditableListEmptyStateComponent,
    EditableListEntryComponent,
    EditableListEntryPrefixComponent,
    EditableListEntrySuffixComponent,
  ],
  exports: [
    EditableListActionComponent,
    EditableListComponent,
    EditableListEmptyStateComponent,
    EditableListEntryComponent,
    EditableListEntryPrefixComponent,
    EditableListEntrySuffixComponent,
  ],
})
export class EditableListModule { }
