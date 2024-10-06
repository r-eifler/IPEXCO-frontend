import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DialogModule } from "src/app/shared/component/dialog/dialog.module";
import { EditableListModule } from "src/app/shared/component/editable-list/editable-list.module";
import { selectedAtLeastOne } from "src/app/validators/selected-at-least-one.validator";
import { PlanProperty } from "../../domain/plan-property/plan-property";
import { PlanProeprtyPanelComponent } from "../plan-proeprty-panel/plan-proeprty-panel.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { PropertyCreationChatComponent } from "../../view/property-creation-chat/property-creation-chat.component";

@Component({
  selector: "app-select-property",
  standalone: true,
  imports: [
    DialogModule,
    EditableListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    PlanProeprtyPanelComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./select-property.component.html",
  styleUrl: "./select-property.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPropertyComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  cancel = output<void>();
  select = output<string[]>();

  properties = input.required<PlanProperty[] | null>();
  hasProperties = computed(() => !!this.properties()?.length);

  form = this.fb.group({
    propertyIds: this.fb.array<FormControl<boolean>>([], [selectedAtLeastOne]),
  });

  constructor() {
    effect(() => {
      this.form.controls.propertyIds.clear();

      this.properties()?.forEach(() => {
        this.form.controls.propertyIds.push(this.fb.control(false));
      });

      this.cd.markForCheck();
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  onSelect() {
    const selectedIndecees =
      this.form.controls.propertyIds.value?.reduce(
        (acc, selected, idx) => (selected ? [...acc, idx] : acc),
        []
      ) ?? [];
    const selectedIds = selectedIndecees.map(
      (index) => this.properties()?.[index]?._id
    );

    this.select.emit(selectedIds);
  }

  createNewProperty(): void {
    this.dialog.open(PropertyCreationChatComponent);
  }
}
