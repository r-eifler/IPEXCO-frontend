import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, take } from 'rxjs';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { Prompt } from '../../domain/prompt';
import { loadDomainSpecifications, loadServices, updatePrompt } from '../../state/globalSpec.actions';
import { selectDomainSpecifications, selectExplainers, selectPrompt } from '../../state/globalSpec.selector';
import { allNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';

@Component({
  selector: 'app-prompt-editor',
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
  templateUrl: './prompt-editor.component.html',
  styleUrl: './prompt-editor.component.scss'
})
export class PromptEditorComponent {
  store = inject(Store);
  fb = inject(FormBuilder);

  prompt$ = this.store.select(selectPrompt);

  domains$ = this.store.select(selectDomainSpecifications);
  explainer$ = this.store.select(selectExplainers);

  domainName$ = combineLatest([this.prompt$, this.domains$]).pipe(
    filter(([prompt, domains]) => !!prompt && !!domains),
    map(([prompt, domains]) => prompt.domain ? domains.find(d => d._id == prompt.domain).name : null)
  )

  explainerName$ = combineLatest([this.prompt$, this.explainer$]).pipe(
    filter(([prompt, explainers]) => !!prompt && !!explainers),
    map(([prompt, explainers]) => prompt.explainer ? explainers.find(e => e._id == prompt.explainer) : null)
  )

  form = this.fb.group({
    name: this.fb.control<string>(null, Validators.required),
    text: this.fb.control<string>(null),
  })

  constructor() {
    this.prompt$.pipe(
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
    this.prompt$.pipe(take(1)).subscribe(prompt => {
      const newPrompt: Prompt = {
        ...prompt,
        name: this.form.controls.name.value,
        text: this.form.controls.text.value,
      }
      this.store.dispatch(updatePrompt({prompt: newPrompt}))
    })
  }
}
