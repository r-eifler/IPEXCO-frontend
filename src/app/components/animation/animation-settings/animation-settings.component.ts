// tslint:disable-next-line: max-line-length
import { AnimationSettingsNomysteryComponent } from './../../plugins/nomystery/animation-settings-nomystery/animation-settings-nomystery.component';
import { CurrentProjectService } from 'src/app/service/project-services';
import { AnimationSettingsDirective } from './../animation-settings.directive';
import { Component, OnInit, ViewChild, AfterViewInit, ComponentFactoryResolver, ViewChildren, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-animation-settings',
  templateUrl: './animation-settings.component.html',
  styleUrls: ['./animation-settings.component.css']
})
export class AnimationSettingsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(AnimationSettingsDirective) animationSettingsHost!: AnimationSettingsDirective;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private currentProjectService: CurrentProjectService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.currentProjectService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      project => {
        if (project) {
          if (project.domainFile.domain === 'nomystery') {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AnimationSettingsNomysteryComponent);

            const viewContainerRef = this.animationSettingsHost.viewContainerRef;
            viewContainerRef.clear();

            viewContainerRef.createComponent(componentFactory);
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
