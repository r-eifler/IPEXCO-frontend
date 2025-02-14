import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, filter, map, switchMap, take, tap } from 'rxjs';
import { ProjectDemoService } from 'src/app/project/service/demo.service';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { updateDemo } from '../../state/demo.actions';
import { selectDemo } from '../../state/demo.selector';
import { Demo } from 'src/app/shared/domain/demo';
import { filterListNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';

@Component({
  selector: 'app-demo-edit-view',
  imports: [
    PageModule,
    BreadcrumbModule,
    AsyncPipe,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './demo-edit-view.component.html',
  styleUrl: './demo-edit-view.component.scss'
})
export class DemoEditViewComponent {

  host = window.location.protocol + "//" + window.location.host;

  store = inject(Store);
  fb = inject(FormBuilder);
  uploadService = inject(ProjectDemoService);
  router = inject(Router);

  form = this.fb.group({
    main: this.fb.group({
      name: this.fb.control<string>("", Validators.required),
      description: this.fb.control<string>("TODO", Validators.required),
    }),
    taskInfo: this.fb.group({
      domainInfo: this.fb.control<string>(""),
      instanceInfo: this.fb.control<string>(""),
    }),
    image: this.fb.control<File | null>(null),
  });

  demo$ = this.store.select(selectDemo)

  imagePath$ = new BehaviorSubject<string | null>(null);

  imageFile$ = new BehaviorSubject<any>(null);
  imageFileName$ = this.imageFile$.pipe(map(f => f?.name));
  imageSelected = false;
  imageUploaded$ = this.imagePath$.pipe(map(path => path !== null))

  constructor(){
    this.demo$.pipe(
      takeUntilDestroyed(),
      filter(demo => !!demo)
    ).subscribe(
      demo => this.initForm(demo)
    );

    this.imageFile$.pipe(
      takeUntilDestroyed(),
      filter(f => !!f),
      switchMap(f => this.uploadService.postDemoImage$(f).pipe(
        tap(path => path !==  null ? this.imagePath$.next(path) : true))
      )
    ).subscribe();

  }

  initForm(demo: Demo){
    this.form.controls.main.controls.name.setValue(demo.name);
    this.form.controls.main.controls.description.setValue(demo.description);
    this.form.controls.taskInfo.controls.instanceInfo.setValue(demo.instanceInfo);

    this.imagePath$.next(demo.summaryImage);

  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0)
      this.imageFile$.next(input.files[0]);
  }

  save(){
    combineLatest([this.demo$, this.imagePath$]).pipe(
      take(1),
      filterListNotNullOrUndefined(),
    ).subscribe(
      ([demo, imagePath]) => {
        const newDemo: Demo = {
          ...demo,
          name: this.form.controls.main.controls.name.value ?? 'TODO',
          summaryImage: imagePath,
          description: this.form.controls.main.controls.description.value ?? 'TODO',
          instanceInfo: this.form.controls.taskInfo.controls.instanceInfo.value ?? 'TODO',
        };

        this.store.dispatch(updateDemo({demo: newDemo}))

        this.router.navigate(['/demos', demo._id, 'details']);
    });
  }
}
