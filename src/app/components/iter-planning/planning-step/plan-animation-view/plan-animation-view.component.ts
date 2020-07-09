import {AnimationHandler} from '../../../../plan-visualization/integration/animation-handler';
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


interface Action {
  name: string;
  args: string[];
}

@Component({
  selector: 'app-plan-animation-view',
  templateUrl: './plan-animation-view.component.html',
  styleUrls: ['./plan-animation-view.component.css']
})
export class PlanAnimationViewComponent implements OnInit, AfterViewInit {

  @ViewChild('animationcontainer') animationContainer: ElementRef;

  @Input()
  set visible(val: boolean) {
    if (val) {
      this.animationHandler.updateAnimationView();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public animationHandler: AnimationHandler) {

  }

  ngAfterViewInit(): void {
    this.animationHandler.getAnimationDOMElement()
    .subscribe(
      elem => {
        if (elem) {
          this.animationContainer.nativeElement.appendChild(elem);
        }
      }
    );
  }

  ngOnInit(): void {
  }


  newQuestion() {
    this.router.navigate(['./new-question'], { relativeTo: this.route });
  }

}


