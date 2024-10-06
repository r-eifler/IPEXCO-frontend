import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { JsonPipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogModule } from 'src/app/shared/component/dialog/dialog.module';
import { EditableListModule } from 'src/app/shared/component/editable-list/editable-list.module';
import { selectedAtLeastOne } from 'src/app/validators/selected-at-least-one.validator';
import { PlanProperty } from '../../domain/plan-property/plan-property';
import { PlanProeprtyPanelComponent } from '../plan-proeprty-panel/plan-proeprty-panel.component';

@Component({
  selector: 'app-select-property',
  standalone: true,
  imports: [ DialogModule, MatButtonModule, MatCheckboxModule, EditableListModule, MatIconModule, PlanProeprtyPanelComponent, ReactiveFormsModule, JsonPipe ],
  templateUrl: './select-property.component.html',
  styleUrl: './select-property.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPropertyComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  cancel = output<void>();
  select = output<string[]>();

  properties = input.required<PlanProperty[] | null>();

  form = this.fb.group({
    propertyIds: this.fb.array<FormControl<boolean>>([], [selectedAtLeastOne])
  });

  constructor() {
    effect(() => {
      this.form.controls.propertyIds.clear();

      this.properties()?.forEach(() => {
        this.form.controls.propertyIds.push(this.fb.control(false))
      })

      this.cd.markForCheck();
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  onSelect() {
    const selectedIndecees = this.form.controls.propertyIds.value?.reduce((acc, selected, idx) => selected ? [...acc, idx] : acc, []) ?? [];
    const selectedIds = selectedIndecees.map(index => this.properties()?.[index]?._id);

    this.select.emit(selectedIds);
  }
}
