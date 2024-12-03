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
import { PlanPropertyPanelComponent } from "../../../shared/component/plan-property-panel/plan-property-panel.component";
import { take } from "rxjs";
import { Store } from "@ngrx/store";
import { UserRoleDirective } from "src/app/user/directives/user-role.directive";
import { createPlanProperty } from "../../state/iterative-planning.actions";
import { PropertyCreatorComponent } from "../../view/property-creator/property-creator.component";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";

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
    PlanPropertyPanelComponent,
    ReactiveFormsModule,
    UserRoleDirective
  ],
  templateUrl: "./select-property.component.html",
  styleUrl: "./select-property.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPropertyComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  private store = inject(Store);

  cancel = output<void>();
  select = output<string[]>();

  properties = input.required<PlanProperty[] | null>();
  hasProperties = computed(() => !!this.properties()?.length);

  form = this.fb.group({
    propertyIds: this.fb.array<FormControl<boolean>>([], [selectedAtLeastOne]),
  });

  constructor(
  ) {
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
    const dialogRef = this.dialog.open(PropertyCreatorComponent);
      dialogRef.afterClosed().pipe(take(1)).subscribe(newP => {
        if(!newP){
          return
        }
        console.log(newP);
        this.store.dispatch(createPlanProperty({planProperty: newP}))
      }
      );
  }
}
