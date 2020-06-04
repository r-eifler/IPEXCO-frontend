import { AnimationHandler } from '../../../../plan-visualization/integration/animation-handler';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


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

  @ViewChild('planvisualizationcanvas') animationContainer: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public animationHandler: AnimationHandler) {

  }

  ngAfterViewInit(): void {
    console.log('Animation-Container: ' + this.animationContainer);
    this.animationHandler.displayAnimationIn(this.animationContainer);
  }

  ngOnInit(): void {
  }


  newQuestion() {
    this.router.navigate(['./new-question'], { relativeTo: this.route });
  }

}


