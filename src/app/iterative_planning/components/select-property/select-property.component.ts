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
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DialogModule } from "src/app/shared/component/dialog/dialog.module";
import { EditableListModule } from "src/app/shared/component/editable-list/editable-list.module";
import { selectedAtLeastOne } from "src/app/validators/selected-at-least-one.validator";
import { PlanProperty } from "../../domain/plan-property/plan-property";
import { PropertyCreationChatComponent } from "../../view/property-creation-chat/property-creation-chat.component";
import { PlanProeprtyPanelComponent } from "../plan-proeprty-panel/plan-proeprty-panel.component";
import { Observable, take } from "rxjs";
import { Store } from "@ngrx/store";
import { selectIterativePlanningProjectCreationInterfaceType } from "../../state/iterative-planning.selector";
import { PropertyCreationInterfaceType } from "src/app/project/domain/general-settings";
import { PropertyCreationTemplateBasedComponent } from "../../view/property-creation-template-based/property-creation-template-based.component";

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

  interfaceType$: Observable<PropertyCreationInterfaceType>

  cancel = output<void>();
  select = output<string[]>();

  properties = input.required<PlanProperty[] | null>();
  hasProperties = computed(() => !!this.properties()?.length);

  form = this.fb.group({
    propertyIds: this.fb.array<FormControl<boolean>>([], [selectedAtLeastOne]),
  });

  constructor(
    store: Store
  ) {
    this.interfaceType$ = store.select(selectIterativePlanningProjectCreationInterfaceType);

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
    this.interfaceType$.pipe(take(1)).subscribe(
      type => {
        switch (type) {
          case PropertyCreationInterfaceType.LLM_CHAT:
            this.dialog.open(PropertyCreationChatComponent);
            break;
          case PropertyCreationInterfaceType.TEMPLATE_BASED:
            this.dialog.open(PropertyCreationTemplateBasedComponent);
            break;
        }
      }
    );
    
  }
}
