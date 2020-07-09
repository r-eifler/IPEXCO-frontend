import {CurrentProjectService, ProjectsService} from 'src/app/service/project/project-services';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {DemosService, RunningDemoService} from '../../../service/demo/demo-services';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {DemoSettingsComponent} from '../demo-settings/demo-settings.component';
import {Demo} from 'src/app/interface/demo';
import {RunStatus} from 'src/app/interface/run';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ExecutionSettingsService} from 'src/app/service/settings/execution-settings.service';
import {AnimationsSettingsDemoComponent} from '../../animation/animations-settings-demo/animations-settings-demo.component';
import {Project} from 'src/app/interface/project';
import {AuthenticationService} from '../../../service/authentication/authentication.service';
import {DemoCreatorComponent} from '../demo-creator/demo-creator.component';

@Component({
  selector: 'app-demo-selection',
  templateUrl: './demo-collection.component.html',
  styleUrls: ['./demo-collection.component.scss']
})
export class DemoCollectionComponent implements OnInit, OnDestroy {

  isMobile: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;
  public demos$: Observable<Demo[]>;

  constructor(
    private responsiveService: ResponsiveService,
    private demosService: DemosService,
    private runningDemoService: RunningDemoService,
    private currentProjectService: CurrentProjectService,
    private projectsService: ProjectsService,
    private settingsService: ExecutionSettingsService,
    public userService: AuthenticationService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

      this.demos$ = demosService.getList();
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

    this.demosService.findCollection();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteDemo(demo: Demo): void {
    this.demosService.deleteObject(demo);
  }

  async cancelDemo(demo: Demo): Promise<void> {
    const canceld = await this.demosService.cancelDemo(demo);
    console.log(canceld);
    if (canceld) {
      this.snackBar.open('Demo canceld successfully!', 'close', {duration: 2000});
    } else {
      this.snackBar.open('Cancel demo failed!', 'close', {duration: 2000});
    }

  }

  update(demo: Demo): void {
    console.log('update Demo');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      update: true,
      projectId: demo._id,
      demo,
    };

    const dialogRef = this.dialog.open(DemoCreatorComponent, dialogConfig);
  }

  openDemo(demo: Demo): void {
    this.router.navigate(['../demos/' + demo._id], {relativeTo: this.activatedRoute});
  }

  async openSettings(demo: Demo) {
    await this.settingsService.load(demo.settings);
    this.bottomSheet.open(DemoSettingsComponent, {data: {settings: this.settingsService.getSelectedObject().value, name: demo.name}});
  }

  openAnimationSettings(demo: Demo) {
    this.runningDemoService.saveObject(demo);
    this.projectsService.getObject(demo._id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((project: Project) => {
      this.currentProjectService.saveObject(project);
    });
    this.bottomSheet.open(AnimationsSettingsDemoComponent, {data: demo});
  }

  myDemo(demo: Demo): boolean {
    if (this.userService.getUser()) {
      return this.userService.getUser()._id === demo.user;
    }
    return false;
  }

}
