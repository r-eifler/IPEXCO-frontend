import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { createDomainSpecification, createExplainer, createPlanner, deleteDomainSpecification, deleteExplainer, deletePlanner, loadDomainSpecifications, loadExplainers, loadPlanners, loadPrompts } from '../../state/globalSpec.actions';
import { selectDomainSpecifications, selectExplainers, selectPlanners, selectPrompts } from '../../state/globalSpec.selector';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateSectionComponent } from 'src/app/shared/components/empty-state/empty-state-section/empty-state-section.component';
import { MatDialog } from '@angular/material/dialog';
import { ServiceCreatorComponent } from '../sercive-creator/sercive-creator.component';
import { filter, map, take } from 'rxjs';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { EditableListModule } from 'src/app/shared/components/editable-list/editable-list.module';
import { DomainSpecCreatorComponent } from '../domain-spec-creator/domain-spec-creator.component';
import { DomainSpecCardComponent } from '../../components/domain-spec-card/domain-spec-card.component';


@Component({
  selector: 'app-specification-overview',
  imports: [
    PageModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    EmptyStateSectionComponent,
    ServiceCardComponent,
    EditableListModule,
    DomainSpecCardComponent
  ],
  templateUrl: './specification-overview.component.html',
  styleUrl: './specification-overview.component.scss'
})
export class SpecificationOverviewComponent {

  store = inject(Store);

  dialog = inject(MatDialog);

  domainSpecifications$ = this.store.select(selectDomainSpecifications);
  prompts$ = this.store.select(selectPrompts);
  planners$ = this.store.select(selectPlanners);
  explainers$ = this.store.select(selectExplainers);


  domains$ = this.domainSpecifications$.pipe(
    filter(specs => !!specs),
    map(specs => specs.map(spec => ({_id: spec._id, name: spec.name})))
  );

  constructor() {
    this.store.dispatch(loadDomainSpecifications());
    this.store.dispatch(loadPrompts());
    this.store.dispatch(loadPlanners());
    this.store.dispatch(loadExplainers());
  }

  onNewDomainSpec() {
    let dialogRef = this.dialog.open(DomainSpecCreatorComponent);
    dialogRef.afterClosed().pipe(take(1)).subscribe(spec =>{
      if(spec){
        this.store.dispatch(createDomainSpecification({domainSpecification: spec}))
      }
    })
  }

  onNewPlanner() {
    this.domains$.pipe(take(1)).subscribe(domains => {
      let dialogRef = this.dialog.open(ServiceCreatorComponent, {data: {serviceType: 'Planner', domains}});
      dialogRef.afterClosed().pipe(take(1)).subscribe(service =>{
        if(service){
          this.store.dispatch(createPlanner({planner: service}))
        }
      });
    })
  }

  onNewExplainer() {
    this.domains$.pipe(take(1)).subscribe(domains => {
      let dialogRef = this.dialog.open(ServiceCreatorComponent, {data: {serviceType: 'Explainer'}});
      dialogRef.afterClosed().pipe(take(1)).subscribe(service =>{
        if(service){
          this.store.dispatch(createExplainer({explainer: service}))
        }
      });
    });
  }

  removeDomainSpec(id: string){
    this.store.dispatch(deleteDomainSpecification({id}))
  }

  removePlanner(id: string){
    this.store.dispatch(deletePlanner({id}))
  }

  removeExplainer(id: string){
    this.store.dispatch(deleteExplainer({id}))
  }

  editDomainSpec(id: string){
    console.log("TODO")
  }

}
