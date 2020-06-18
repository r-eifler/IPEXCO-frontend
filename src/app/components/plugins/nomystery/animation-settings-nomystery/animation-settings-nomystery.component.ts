import { AnimationSettingsNoMysteryVisu } from '../../../../plan-visualization/plugins/nomystery3D/settings/animation-settings-nomystery-visu';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AnimationSettings } from 'src/app/interface/animation-settings';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { TaskSchemaService } from 'src/app/service/schema.service';
import { CurrentProjectService, ProjectsService } from 'src/app/service/project-services';

@Component({
  selector: 'app-animation-settings-nomystery',
  templateUrl: './animation-settings-nomystery.component.html',
  styleUrls: ['./animation-settings-nomystery.component.css']
})
export class AnimationSettingsNomysteryComponent implements OnInit, AfterViewInit {

  isMobile: boolean;

  @ViewChild('animationsettingscontainer') locationSettingsContainer: ElementRef;

  private animationSettings: AnimationSettingsNoMysteryVisu;

  constructor(
    private responsiveService: ResponsiveService,
    private taskSchemaService: TaskSchemaService,
    private projectService: CurrentProjectService,
    private projectsService: ProjectsService,
  ) {
    this.animationSettings = new AnimationSettingsNoMysteryVisu(taskSchemaService, projectService, projectsService);
  }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus().subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();
  }

  ngAfterViewInit(): void {
    const obs$ = this.animationSettings.displayElemObservable();
    obs$.subscribe(
      elems => {
        for ( const e of elems) {
          this.locationSettingsContainer.nativeElement.appendChild(e);
        }
      }
    );
  }

  saveSettings() {
    console.log('save settings');
    this.animationSettings.save();
  }

}
