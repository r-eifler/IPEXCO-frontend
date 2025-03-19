import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectDomainSpecification } from '../../state/globalSpec.selector';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlanPropertyTemplate } from 'src/app/shared/domain/plan-property/plan-property-template';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { jsonValidator } from 'src/app/validators/json.validator';
import { DomainSpecification } from '../../domain/domain_specification';
import { updateDomainSpecification } from '../../state/globalSpec.actions';
import { Encoding } from '../../domain/services';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-domain-spec-editor',
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
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './domain-spec-editor.component.html',
  styleUrl: './domain-spec-editor.component.scss'
})
export class DomainSpecEditorComponent {

  encodings = [
    Encoding.DOMAIN_DEPENDENT,
    Encoding.PDDL_CLASSIC,
    Encoding.PDDL_NUMERIC
  ]

  store = inject(Store);
  fb = inject(FormBuilder);

  domainSpec$ = this.store.select(selectDomainSpecification);

  form = this.fb.group({
    name: this.fb.control<string | null>(null, Validators.required),
    encoding: this.fb.control<Encoding | null>(null, Validators.required),
    description: this.fb.control<string | null>(null),
    templates: this.fb.control<string>("[]", [Validators.required, jsonValidator]),
  })

  constructor() {
    this.domainSpec$.pipe(
      takeUntilDestroyed(),
      filter(spec => !!spec)
    ).subscribe(spec => {
      this.form.controls.name.setValue(spec.name);
      this.form.controls.encoding.setValue(spec.encoding);
      this.form.controls.description.setValue(spec.description);
      this.form.controls.templates.setValue(JSON.stringify(spec.planPropertyTemplates, null, "\t"));
    });
  }

  onSave() {
    this.domainSpec$.pipe(take(1)).subscribe(spec => {
      if(spec === undefined){
        return;
      }
      const newDomainSpec: DomainSpecification = {
        ...spec,
        name: this.form.controls.name.value ?? 'TODO',
        encoding: this.form.controls.encoding.value ?? Encoding.NONE,
        planPropertyTemplates: this.form.controls.templates.value !==  null ? JSON.parse(this.form.controls.templates.value) : [],
        description: this.form.controls.description.value ?? 'TODO',
      }
      this.store.dispatch(updateDomainSpecification({domainSpecification: newDomainSpec}))
    })
  }
}
