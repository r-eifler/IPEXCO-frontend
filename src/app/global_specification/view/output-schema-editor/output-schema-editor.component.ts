import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, take } from 'rxjs';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { OutputSchema, } from '../../domain/prompt';
import { loadDomainSpecifications, loadServices, updateOutputSchema } from '../../state/globalSpec.actions';
import { selectOutputSchema, selectDomainSpecifications, selectExplainers } from '../../state/globalSpec.selector';
import { jsonValidator } from 'src/app/validators/json.validator';

@Component({
  selector: 'app-output-schema-editor',
  imports: [
    PageModule,
    BreadcrumbModule,
    RouterLink,
    MatIconModule,
    AsyncPipe,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule
  ],
  templateUrl: './output-schema-editor.component.html',
  styleUrl: './output-schema-editor.component.scss'
})
export class OutputSchemaEditorComponent {

  store = inject(Store);
  fb = inject(FormBuilder);
  
  schema$ = this.store.select(selectOutputSchema);

  domains$ = this.store.select(selectDomainSpecifications);
  explainer$ = this.store.select(selectExplainers);

  domainName$ = combineLatest([this.schema$, this.domains$]).pipe(
    filter(([schema, domains]) => !!schema && !!domains),
    map(([schema, domains]) => schema.domain ? domains.find(d => d._id == schema.domain).name : null)
  )

  explainerName$ = combineLatest([this.schema$, this.explainer$]).pipe(
    filter(([schema, explainers]) => !!schema && !!explainers),
    map(([schema, explainers]) => schema.explainer ? explainers.find(e => e._id == schema.explainer) : null)
  )

  form = this.fb.group({
    name: this.fb.control<string>(null, Validators.required),
    text: this.fb.control<string>(null, jsonValidator),
  })

  constructor() {
    this.schema$.pipe(
      takeUntilDestroyed(),
      filter(spec => !!spec)
    ).subscribe(spec => {
      this.form.controls.name.setValue(spec.name);
      this.form.controls.text.setValue(spec.text);
    });


    this.store.dispatch(loadDomainSpecifications());
    this.store.dispatch(loadServices());
  }
  
  onSave() {
    this.schema$.pipe(take(1)).subscribe(schema => {
      const newSchema: OutputSchema = {
        ...schema,
        name: this.form.controls.name.value,
        text: this.form.controls.text.value,
      }
      this.store.dispatch(updateOutputSchema({outputSchema: newSchema}))
    })
  }

}
