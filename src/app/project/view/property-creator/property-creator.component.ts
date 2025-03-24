import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { PropertyCreationTemplateBasedComponent } from 'src/app/shared/view/property-creation-template-based/property-creation-template-based.component';
import { PropertyCreationInterfaceType } from '../../domain/general-settings';
import { selectProjectPlanPropertyCreationInterfaceType, selectProjectPlanPropertyTemplates, selectProjectPlanningTask, selectProjectProperties } from '../../state/project.selector';

@Component({
    selector: 'app-property-creator',
    imports: [
        AsyncPipe,
        PropertyCreationTemplateBasedComponent
    ],
    templateUrl: './property-creator.component.html',
    styleUrl: './property-creator.component.scss'
})
export class PropertyCreatorComponent {

  interfaceType = PropertyCreationInterfaceType;

  store = inject(Store);
  dialogRef = inject(MatDialogRef)

  interfaceType$ = this.store.select(selectProjectPlanPropertyCreationInterfaceType);
  planningTask$ = this.store.select(selectProjectPlanningTask);
  planProperties$ = this.store.select(selectProjectProperties);
  templates$ = this.store.select(selectProjectPlanPropertyTemplates);

  handleCreatedProperty(property: PlanProperty){
    this.dialogRef.close(property);
  }

  handleCancel(){
    this.dialogRef.close(null)
  }

  constructor(){
    this.templates$.pipe(takeUntilDestroyed(),tap(console.log)).subscribe();
  }
}
