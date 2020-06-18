// tslint:disable-next-line: max-line-length
import { AnimationSettingsNomysteryComponent } from './../../plugins/nomystery/animation-settings-nomystery/animation-settings-nomystery.component';
import { CurrentProjectService } from 'src/app/service/project-services';
import { AnimationSettingsDirective } from './../animation-settings.directive';
import { Component, OnInit, ViewChild, AfterViewInit, ComponentFactoryResolver, ViewChildren } from '@angular/core';


@Component({
  selector: 'app-animation-settings',
  templateUrl: './animation-settings.component.html',
  styleUrls: ['./animation-settings.component.css']
})
export class AnimationSettingsComponent implements OnInit, AfterViewInit {

  @ViewChild(AnimationSettingsDirective) animationSettingsHost!: AnimationSettingsDirective;

  constructor(
    private projectService: CurrentProjectService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.projectService.getSelectedObject().subscribe(
      project => {
        if (project) {
          if (project.domainFile.domain === 'nomystery') {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AnimationSettingsNomysteryComponent);

            const viewContainerRef = this.animationSettingsHost.viewContainerRef;
            viewContainerRef.clear();

            const componentRef = viewContainerRef.createComponent(componentFactory);
          }
        }
      }
    );
  }
}
