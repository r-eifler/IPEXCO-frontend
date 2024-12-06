import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  NO_ERRORS_SCHEMA,
  output,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DialogModule } from "src/app/shared/components/dialog/dialog.module";
import { EditableListModule } from "src/app/shared/components/editable-list/editable-list.module";
import { selectedAtLeastOne } from "src/app/validators/selected-at-least-one.validator";
import { take, tap} from "rxjs";
import { Store } from "@ngrx/store";
import { UserRoleDirective } from "../../../user/directives/user-role.directive"
import { PlanPropertyPanelComponent } from "src/app/shared/components/plan-property-panel/plan-property-panel.component";
import { PropertyCreatorComponent } from "../../view/property-creator/property-creator.component";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";

@Component({
  selector: "app-demo-select-property",
  standalone: true,
  imports: [
    DialogModule,
    EditableListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    PlanPropertyPanelComponent,
    ReactiveFormsModule,
    UserRoleDirective,
  ],
  schemas:[
    NO_ERRORS_SCHEMA
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
  select = output<PlanProperty[]>();

  properties = input.required<PlanProperty[] | null>();

  newProperties = signal([]);
  availableProperties = computed(() => this.properties().concat(this.newProperties()))
  hasProperties = computed(() => !!this.availableProperties()?.length);

  form = this.fb.group({
    propertyIds: this.fb.array<FormControl<boolean>>([], [selectedAtLeastOne]),
  });

  constructor(
  ) {

    effect(() => {
      this.form.controls.propertyIds.clear();

      this.availableProperties()?.forEach(() => {
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
    const selectedProperties = selectedIndecees.map(
      (index) => this.availableProperties()?.[index]
    );
    console.log(selectedProperties);
    this.select.emit(selectedProperties);
  }

  createNewProperty(): void {
    const dialogRefTemplates = this.dialog.open(PropertyCreatorComponent);
    dialogRefTemplates.afterClosed().pipe(
      take(1),
    ).subscribe(
      newP => {
        if(!newP){
          return;
        }
        this.newProperties.update(props => props.concat([newP]))
      }
    );
  }
}
