import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { createDomainSpecification, createExplainer, createOutputSchema, createPlanner, createPrompt, deleteDomainSpecification, deleteExplainer, deleteOutputSchema, deletePlanner, deletePrompt, loadDomainSpecifications, loadExplainers, loadOutputSchemas, loadPlanners, loadPrompts } from '../../state/globalSpec.actions';
import { selectDomainSpecifications, selectExplainers, selectOutputSchemas, selectPlanners, selectPrompts } from '../../state/globalSpec.selector';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateSectionComponent } from 'src/app/shared/components/empty-state/empty-state-section/empty-state-section.component';
import { MatDialog } from '@angular/material/dialog';
import { ServiceCreatorComponent } from '../sercive-creator/sercive-creator.component';
import { combineLatest, filter, map, take } from 'rxjs';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { EditableListModule } from 'src/app/shared/components/editable-list/editable-list.module';
import { DomainSpecCreatorComponent } from '../domain-spec-creator/domain-spec-creator.component';
import { DomainSpecCardComponent } from '../../components/domain-spec-card/domain-spec-card.component';
import { RouterLink } from '@angular/router';
import { PromptCreatorComponent } from '../prompt-creator/prompt-creator.component';
import { OutputSchemaCreatorComponent } from '../output-schema-creator/output-schema-creator.component';
import { PromptCardComponent } from '../../components/prompt-card/prompt-card.component';
import { OutputSchemaCardComponent } from '../../components/output-schema-card/output-schema-card.component';


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
    DomainSpecCardComponent,
    RouterLink,
    PromptCardComponent,
    OutputSchemaCardComponent
  ],
  templateUrl: './specification-overview.component.html',
  styleUrl: './specification-overview.component.scss'
})
export class SpecificationOverviewComponent {

  store = inject(Store);

  dialog = inject(MatDialog);

  domainSpecifications$ = this.store.select(selectDomainSpecifications);
  prompts$ = this.store.select(selectPrompts);
  outputSchemas$ = this.store.select(selectOutputSchemas);
  planners$ = this.store.select(selectPlanners);
  explainers$ = this.store.select(selectExplainers);


  domains$ = this.domainSpecifications$.pipe(
    filter(specs => !!specs),
    map(specs => specs.map(spec => ({_id: spec._id, name: spec.name})))
  );

  constructor() {
    this.store.dispatch(loadDomainSpecifications());
    this.store.dispatch(loadPrompts());
    this.store.dispatch(loadOutputSchemas());
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
      let dialogRef = this.dialog.open(ServiceCreatorComponent, {data: {serviceType: 'Explainer', domains}});
      dialogRef.afterClosed().pipe(take(1)).subscribe(service =>{
        if(service){
          this.store.dispatch(createExplainer({explainer: service}))
        }
      });
    });
  }

  onNewPrompt() {
    combineLatest([this.domains$, this.explainers$]).pipe(take(1)).subscribe(([domains, explainers]) => {
      let dialogRef = this.dialog.open(PromptCreatorComponent, {data: {domains, explainers}});
      dialogRef.afterClosed().pipe(take(1)).subscribe(prompt =>{
        if(prompt){
          this.store.dispatch(createPrompt({prompt}))
        }
      });
    });
  }

  onNewOutputSchema() {
    combineLatest([this.domains$, this.explainers$]).pipe(take(1)).subscribe(([domains, explainers]) => {
      let dialogRef = this.dialog.open(OutputSchemaCreatorComponent, {data: {domains, explainers}});
      dialogRef.afterClosed().pipe(take(1)).subscribe(schema =>{
        if(schema){
          this.store.dispatch(createOutputSchema({outputSchema: schema}))
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

  removePrompt(id: string){
    this.store.dispatch(deletePrompt({id}))
  }

  removeOutputSchema(id: string){
    this.store.dispatch(deleteOutputSchema({id}))
  }

}
