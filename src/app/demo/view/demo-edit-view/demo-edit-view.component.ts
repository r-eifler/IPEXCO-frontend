import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDemo } from '../../state/demo.selector';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, combineLatest, filter, map, startWith, switchMap, take, tap } from 'rxjs';
import { ProjectDemoService } from 'src/app/project/service/demo.service';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Demo } from 'src/app/project/domain/demo';
import { updateDemo } from '../../state/demo.actions';

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
      description: this.fb.control<string>(""),
    }),
    taskInfo: this.fb.group({
      domainInfo: this.fb.control<string>(""),
      instanceInfo: this.fb.control<string>(""),
    }),
    image: this.fb.control<File>(null),
  });

  demo$ = this.store.select(selectDemo)

  imagePath$ = new BehaviorSubject<string>(null);

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
      tap(console.log),
      filter(f => !!f),
      switchMap(f => this.uploadService.postDemoImage$(f).pipe(tap(path => this.imagePath$.next(path))))
    ).subscribe();

    this.imageFile$.pipe(takeUntilDestroyed()).subscribe(path => console.log(path));
    this.imagePath$.pipe(takeUntilDestroyed()).subscribe(path => console.log(path));
  }

  initForm(demo: Demo){
    console.log(demo);
    this.form.controls.main.controls.name.setValue(demo.name);
    this.form.controls.main.controls.description.setValue(demo.description);
    this.form.controls.taskInfo.controls.domainInfo.setValue(demo.domainInfo);
    this.form.controls.taskInfo.controls.instanceInfo.setValue(demo.instanceInfo);

    this.imagePath$.next(demo.summaryImage);

  }

  onFileChanged(event) {
    this.imageFile$.next(event.target.files[0]);
  }

  save(){
    combineLatest([this.demo$, this.imagePath$]).pipe(take(1)).subscribe(
      ([demo, imagePath]) => {
        const newDemo: Demo = {
          ...demo,
          name: this.form.controls.main.controls.name.value,
          summaryImage: imagePath,
          description: this.form.controls.main.controls.description.value,
          domainInfo: this.form.controls.taskInfo.controls.domainInfo.value,
          instanceInfo: this.form.controls.taskInfo.controls.instanceInfo.value,
        };

        console.log("New Demo:");
        console.log(newDemo);

        this.store.dispatch(updateDemo({demo: newDemo}))

        this.router.navigate(['/demos', demo._id, 'details']);
    });
  }
}
