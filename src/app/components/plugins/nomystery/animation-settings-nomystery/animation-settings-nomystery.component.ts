import {takeUntil} from 'rxjs/operators';
import {AnimationSettingsNoMysteryVisu} from '../../../../plan-visualization/plugins/nomystery3D/settings/animation-settings-nomystery-visu';
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ResponsiveService} from 'src/app/service/responsive.service';
import {TaskSchemaService} from 'src/app/service/schema.service';
import {CurrentProjectService, ProjectsService} from 'src/app/service/project-services';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-animation-settings-nomystery',
  templateUrl: './animation-settings-nomystery.component.html',
  styleUrls: ['./animation-settings-nomystery.component.css']
})
export class AnimationSettingsNomysteryComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  @ViewChild('animationsettingscontainer') locationSettingsContainer: ElementRef;

  public animationSettings: AnimationSettingsNoMysteryVisu;

  constructor(
    private responsiveService: ResponsiveService,
    private taskSchemaService: TaskSchemaService,
    private projectService: CurrentProjectService,
    private projectsService: ProjectsService,
  ) {
    this.animationSettings = new AnimationSettingsNoMysteryVisu(taskSchemaService, projectService, projectsService);
  }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
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
    obs$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      elems => {
        for ( const e of elems) {
          this.locationSettingsContainer.nativeElement.appendChild(e);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  saveSettings() {
    this.animationSettings.save();
  }

}
