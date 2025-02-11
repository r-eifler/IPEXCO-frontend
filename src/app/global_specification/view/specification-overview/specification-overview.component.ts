import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, take } from 'rxjs';
import { EditableListModule } from 'src/app/shared/components/editable-list/editable-list.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { DomainSpecCardComponent } from '../../components/domain-spec-card/domain-spec-card.component';
import { OutputSchemaCardComponent } from '../../components/output-schema-card/output-schema-card.component';
import { PromptCardComponent } from '../../components/prompt-card/prompt-card.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import {
  createDomainSpecification,
  createOutputSchema,
  createPrompt,
  createService,
  deleteDomainSpecification,
  deleteOutputSchema,
  deletePrompt,
  deleteService,
  loadDomainSpecifications,
  loadOutputSchemas,
  loadPrompts,
  loadServices
} from '../../state/globalSpec.actions';
import { selectDomainSpecifications, selectExplainers, selectOutputSchemas, selectPlanners, selectPrompts, selectServices } from '../../state/globalSpec.selector';
import { DomainSpecCreatorComponent } from '../domain-spec-creator/domain-spec-creator.component';
import { OutputSchemaCreatorComponent } from '../output-schema-creator/output-schema-creator.component';
import { PromptCreatorComponent } from '../prompt-creator/prompt-creator.component';
import { ServiceCreatorComponent } from '../sercive-creator/sercive-creator.component';


@Component({
  selector: 'app-specification-overview',
  imports: [
    PageModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
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
  services$ = this.store.select(selectServices);
  explainers$ = this.store.select(selectExplainers);


  domains$ = this.domainSpecifications$.pipe(
    filter(specs => !!specs),
    map(specs => specs.map(spec => ({_id: spec._id, name: spec.name})))
  );

  constructor() {
    this.store.dispatch(loadDomainSpecifications());
    this.store.dispatch(loadPrompts());
    this.store.dispatch(loadOutputSchemas());
    this.store.dispatch(loadServices());
  }

  onNewDomainSpec() {
    let dialogRef = this.dialog.open(DomainSpecCreatorComponent);
    dialogRef.afterClosed().pipe(take(1)).subscribe(spec =>{
      if(spec){
        this.store.dispatch(createDomainSpecification({domainSpecification: spec}))
      }
    })
  }

  onNewService() {
    this.domains$.pipe(take(1)).subscribe(domains => {
      let dialogRef = this.dialog.open(ServiceCreatorComponent, {data: {serviceType: 'Service', domains}});
      dialogRef.afterClosed().pipe(take(1)).subscribe(service =>{
        if(service){
          this.store.dispatch(createService({service: service}))
        }
      });
    })
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

  removeService(id: string){
    this.store.dispatch(deleteService({id}))
  }

  removePrompt(id: string){
    this.store.dispatch(deletePrompt({id}))
  }

  removeOutputSchema(id: string){
    this.store.dispatch(deleteOutputSchema({id}))
  }

}
