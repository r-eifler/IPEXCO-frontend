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
  WritableSignal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { take } from "rxjs";
import { filterNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";
import { DialogModule } from "src/app/shared/components/dialog/dialog.module";
import { EditableListModule } from "src/app/shared/components/editable-list/editable-list.module";
import { PlanPropertyPanelComponent } from "src/app/shared/components/plan-property-panel/plan-property-panel.component";
import { PlanProperty, PlanPropertyBase } from "src/app/shared/domain/plan-property/plan-property";
import { selectedAtLeastOne } from "src/app/validators/selected-at-least-one.validator";
import { UserRoleDirective } from "../../../user/directives/user-role.directive";
import { PropertyCreatorComponent } from "../../view/property-creator/property-creator.component";

@Component({
    selector: "app-demo-select-property",
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
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    templateUrl: "./select-property.component.html",
    styleUrl: "./select-property.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectPropertyComponent {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  cancel = output<void>();
  select = output<PlanPropertyBase[]>();

  properties = input.required<PlanProperty[] | null>();
  propertyBases = computed(() => this.properties()?.map(pp => {
    return {...pp} as PlanPropertyBase
  }));

  newProperties : WritableSignal<PlanPropertyBase[]> = signal([]);
  availableProperties = computed(() => this.propertyBases()?.concat(this.newProperties() ?? []) )
  hasProperties = computed(() => !!this.availableProperties()?.length);

  form = this.fb.group({
    propertyIds: this.fb.array<FormControl<boolean>>([], [selectedAtLeastOne]),
  });

  constructor(
  ) {

    effect(() => {
      this.form.controls.propertyIds.clear();

      this.availableProperties()?.forEach(() => {
        this.form.controls.propertyIds.push(this.fb.control(false, {nonNullable: true}));
      });

      this.cd.markForCheck();
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  onSelect() {
    const selectedIndecees: number[] =
      this.form.controls.propertyIds.value?.reduce(
        (acc, selected, idx) => (selected ? [...acc, idx] : acc),
        [] as number[]
      ) ?? [];
    const selectedProperties = selectedIndecees.map(
      (index) => this.availableProperties()?.[index]
    ).filter(pp => pp !== undefined);

    this.select.emit(selectedProperties);
  }

  createNewProperty(): void {
    const dialogRefTemplates = this.dialog.open<PropertyCreatorComponent, never, PlanPropertyBase>(PropertyCreatorComponent);
    dialogRefTemplates.afterClosed().pipe(
      take(1),
      filterNotNullOrUndefined()
    ).subscribe(
      newP => {
        this.newProperties.update(props => props.concat([newP]))
      }
    );
  }
}
