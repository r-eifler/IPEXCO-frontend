import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';
import { PropertyCreationTemplateBasedComponent } from 'src/app/shared/view/property-creation-template-based/property-creation-template-based.component';
import { AsyncPipe } from '@angular/common';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { PropertyCreationInterfaceType } from 'src/app/project/domain/general-settings';
import { selectIterativePlanningProjectCreationInterfaceType, selectIterativePlanningProjectId, selectIterativePlanningProperties, selectIterativePlanningPropertyTemplates, selectIterativePlanningTask } from '../../state/iterative-planning.selector';
import { PropertyCreationChatComponent } from '../property-creation-chat/property-creation-chat.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-property-creator',
    imports: [
        AsyncPipe,
        PropertyCreationTemplateBasedComponent,
        PropertyCreationChatComponent
    ],
    templateUrl: './property-creator.component.html',
    styleUrl: './property-creator.component.scss'
})
export class PropertyCreatorComponent {

  interfaceType = PropertyCreationInterfaceType;

  store = inject(Store);
  dialogRef = inject(MatDialogRef)

  interfaceType$ = this.store.select(selectIterativePlanningProjectCreationInterfaceType);
  projectId = toSignal(this.store.select(selectIterativePlanningProjectId));
  planningTask$ = this.store.select(selectIterativePlanningTask);
  planProperties$ = this.store.select(selectIterativePlanningProperties);
  templates$ = this.store.select(selectIterativePlanningPropertyTemplates);

  handleCreatedProperty(property: PlanProperty){
    property.project = this.projectId()
    this.dialogRef.close(property);
  }

  handleCancel(){
    this.dialogRef.close(null)
  }
}
