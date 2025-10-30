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
import { DialogModule } from "src/app/shared/components/dialog/dialog.module";
import { EditableListModule } from "src/app/shared/components/editable-list/editable-list.module";
import { selectedAtLeastOne } from "src/app/validators/selected-at-least-one.validator";
import { PlanPropertyPanelComponent } from "../../../shared/components/plan-property-panel/plan-property-panel.component";
import { take } from "rxjs";
import { Store } from "@ngrx/store";
import { UserRoleDirective } from "src/app/user/directives/user-role.directive";
import { createPlanProperty } from "../../state/iterative-planning.actions";
import { PropertyCreatorComponent } from "../../view/property-creator/property-creator.component";
import { PlanProperty, PlanPropertyBase, PlanPropertyOfProject } from "src/app/shared/domain/plan-property/plan-property";
import { AsyncPipe } from "@angular/common";
import { ProjectDirective } from "../../directives/isProject.directive";

@Component({
    selector: "app-select-property",
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
        ProjectDirective,
    ],
    templateUrl: "./select-property.component.html",
    styleUrl: "./select-property.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectPropertyComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  private store = inject(Store);

  cancel = output<void>();
  select = output<string[]>();

  projectId = input.required<string>();
  properties = input.required<PlanProperty[] | null>();
  hasProperties = computed(() => !!this.properties()?.length);

  form = this.fb.group({
    propertyIds: this.fb.array<FormControl<boolean | null>>([], [selectedAtLeastOne]),
  });

  selectAllControl = this.fb.control(false);

  constructor(
  ) {
    effect(() => {
      this.form.controls.propertyIds.clear();

      this.properties()?.forEach(() => {
        this.form.controls.propertyIds.push(this.fb.control(false));
      });

      this.updateSelectAllState();
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
        [] as number[]
      ) ?? [];
    const selectedIds = selectedIndecees.map(
      (index) => this.properties()?.[index]?._id
    ).filter(i => i !== undefined);

    this.select.emit(selectedIds);
  }

  createNewProperty(): void {
    const dialogRef = this.dialog.open(PropertyCreatorComponent);
      dialogRef.afterClosed().pipe(take(1)).subscribe((propertyDef: PlanPropertyBase) => {
        if(!propertyDef){
          return
        }
        const newProperty: PlanPropertyOfProject = {
          ...propertyDef,
          project: this.projectId()
        }
        this.store.dispatch(createPlanProperty({planProperty: newProperty}))
      }
      );
  }

  onSelectAll() {
    const selectAll = this.selectAllControl.value;
    // Convert null to false to handle indeterminate state
    const booleanValue = selectAll === true;
    this.form.controls.propertyIds.controls.forEach(control => {
      control.setValue(booleanValue);
    });
  }

  onPropertySelectionChange() {
    this.updateSelectAllState();
  }

  private updateSelectAllState() {
    const controls = this.form.controls.propertyIds.controls;
    const selectedCount = controls.filter(control => control.value).length;
    const totalCount = controls.length;
    
    if (selectedCount === 0) {
      this.selectAllControl.setValue(false, { emitEvent: false });
    } else if (selectedCount === totalCount) {
      this.selectAllControl.setValue(true, { emitEvent: false });
    } else {
      this.selectAllControl.setValue(null, { emitEvent: false });
    }
  }
}
