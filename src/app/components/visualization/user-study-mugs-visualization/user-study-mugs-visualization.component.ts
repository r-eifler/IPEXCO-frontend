import {Component, inject, input} from '@angular/core';
import {PlanProperty} from '../../../shared/domain/plan-property/plan-property';
import * as drawer from "./helpers/visualization-drawer.js"
import {defaultDataObject, IDataObject} from './Types/IDataObject';
import {Store} from '@ngrx/store';
import {selectIterativePlanningProperties} from '../../../iterative_planning/state/iterative-planning.selector';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-user-study-mugs-visualization',
  templateUrl: './user-study-mugs-visualization.component.html',
  styleUrls: ['./user-study-mugs-visualization.component.scss'],
  imports: [

  ],
  standalone: true
})

export class UserStudyMugsVisualizationComponent {
  private store = inject(Store);
  answer = input.required<string[][] | null>();
  createUniqueIds = input.required<boolean>();

  containerHeaderId: string;
  innerContainerId: string;
  MUGS: Record<string, any>[] = []
  elements: PlanProperty[] = [];
  data: IDataObject = defaultDataObject;

  ngOnInit(): void {
    this.SetContainerId();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.CheckContainer();
      this.Initialize();
      if (!this.createUniqueIds){
        drawer.remove();
      }
      drawer.init(`#${this.containerHeaderId}`, this.innerContainerId);
      drawer.draw(this.data);
    }, 60);
  }

  private SetContainerId(): void {
    if (this.createUniqueIds) {
      this.containerHeaderId = `mugs-vis-${Math.floor((Math.random() * 100) + 1)}`;
      this.innerContainerId = `${Math.floor((Math.random() * 100) + 87 /2 * 34)}`;
    }else{
      this.containerHeaderId = "mugs-vis";
      this.innerContainerId = "";
    }
  }

  private CheckContainer() :void {
    const container = document.querySelector(`#${this.containerHeaderId}`);
    if (!container) {
      throw new Error(`Container with ID "${this.containerHeaderId}" not found.`);
    }
  }

  private GetStepPlanProperties(): PlanProperty[]{
    let planProperties: Observable<Record<string, PlanProperty>> = this.store.select(selectIterativePlanningProperties);
    let result: PlanProperty[] = [];
    planProperties.pipe(take(1)).subscribe(properties => {
      Object.values(properties).forEach((property: PlanProperty) => {
        result.push(property);
      })
    })
    return result;
  }

  private Initialize(): void {
    if (this.answer == null) {
      return;
    }

    const planProperties = this.GetStepPlanProperties();

    this.MUGS = this.answer().map((ids: string[], index: number) => {

      return {
        i: index,
        l: ids.map((id) => {
          const property = planProperties.find((prop) => prop._id === id);
          return property ? property.name : null;
        }),
        s: new Set(ids.map((id) => {
          const property = planProperties.find((prop) => prop._id === id);
          return property ? property.name : null;
        }))
      };
    });

    // Init data Set
    this.data.MUGS = this.MUGS
    this.data.elements = planProperties.filter((prop) => {
      return this.MUGS.some(mug => mug.s.has(prop.name));
    })
  }

}
