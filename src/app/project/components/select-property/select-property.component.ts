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
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { DialogModule } from "src/app/shared/component/dialog/dialog.module";
import { EditableListModule } from "src/app/shared/component/editable-list/editable-list.module";
import { selectedAtLeastOne } from "src/app/validators/selected-at-least-one.validator";
import { PlanProperty } from "../../domain/plan-property/plan-property";
import { PropertyCreationChatComponent } from "../../view/property-creation-chat/property-creation-chat.component";
import { PlanProeprtyPanelComponent } from "../plan-proeprty-panel/plan-proeprty-panel.component";
import { BehaviorSubject, combineLatest, map, Observable, of, skipUntil, skipWhile, take, takeUntil, takeWhile } from "rxjs";
import { Store } from "@ngrx/store";
import { selectIterativePlanningProjectCreationInterfaceType } from "../../state/iterative-planning.selector";
import { PropertyCreationInterfaceType } from "src/app/project/domain/general-settings";
import { PropertyCreationTemplateBasedComponent } from "../../view/property-creation-template-based/property-creation-template-based.component";
import { UserRoleDirective } from "../../../user/directives/user-role.directive"
import { AsyncPipe } from "@angular/common";
import { selectPlanPropertyCreationInterfaceType } from "src/app/project/state/project.selector";

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
    AsyncPipe,
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

  interfaceType$: Observable<PropertyCreationInterfaceType>

  cancel = output<void>();
  select = output<string[]>();

  includeNewNotCreatedProperties = input<boolean>(false);
  properties = input.required<PlanProperty[] | null>();

  newProperties = signal([]);
  availableProperties = computed(() => this.properties().concat(this.newProperties()))
  hasProperties = computed(() => !!this.availableProperties()?.length);

  form = this.fb.group({
    propertyIds: this.fb.array<FormControl<boolean>>([], [selectedAtLeastOne]),
  });

  constructor(
    store: Store
  ) {
    this.interfaceType$ = store.select(selectPlanPropertyCreationInterfaceType);

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
    console.log("Create new Property");
    this.interfaceType$.pipe(take(1)).subscribe(
      type => {
        switch (type) {
          case PropertyCreationInterfaceType.LLM_CHAT:
            const dialogRefChat = this.dialog.open(PropertyCreationChatComponent);
            break;
          case PropertyCreationInterfaceType.TEMPLATE_BASED:
            const dialogRefTemplates = this.dialog.open(
              PropertyCreationTemplateBasedComponent,
              {data: {createProperty: this.includeNewNotCreatedProperties()}}
            );
            dialogRefTemplates.afterClosed().pipe(take(1)).subscribe(
              newP => {
                const extendedProperties = this.newProperties()
                extendedProperties.push(newP)
                this.newProperties.set(extendedProperties)
              }
            )
            break;
        }
      }
    );
    
  }
}
