import { RunningDemoService } from "src/app/service/demo/demo-services";
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AnimationSettingsDirective } from "../animation-settings.directive";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AnimationSettingsNomysteryComponent } from "../../plugins/nomystery/animation-settings-nomystery/animation-settings-nomystery.component";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";

@Component({
  selector: "app-animations-settings-demo",
  templateUrl: "./animations-settings-demo.component.html",
  styleUrls: ["./animations-settings-demo.component.css"],
})
export class AnimationsSettingsDemoComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(AnimationSettingsDirective)
  animationSettingsHost!: AnimationSettingsDirective;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private runningDemoService: RunningDemoService,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<AnimationsSettingsDemoComponent>
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // console.log('Animation Settings Demo');
    this.runningDemoService
      .getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((demo) => {
        if (demo) {
          // if (demo.domain === 'nomystery') {
          const componentFactory =
            this.componentFactoryResolver.resolveComponentFactory(
              AnimationSettingsNomysteryComponent
            );

          const viewContainerRef = this.animationSettingsHost.viewContainerRef;
          viewContainerRef.clear();

          viewContainerRef.createComponent(componentFactory);
          // }
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
