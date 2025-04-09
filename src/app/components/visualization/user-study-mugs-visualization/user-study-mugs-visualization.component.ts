import {Component, inject, input} from '@angular/core';
import {PlanProperty} from '../../../shared/domain/plan-property/plan-property';
// @ts-ignore
import * as drawer from './helpers/visualization-drawer.js'
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
  property = input.required<PlanProperty>();

  containerHeaderId: string | undefined;
  innerContainerId: string | undefined;
  showVisualization: boolean | undefined;
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
      this.ComputeOrderDependentValues()
      this.Sort()
      this.InitVisualization();


    }, 60);
  }

  private InitVisualization(): void {
    if (this.showVisualization) {
      if (!this.createUniqueIds){
        drawer.remove();
      }
      drawer.init(`#${this.containerHeaderId}`, this.innerContainerId);
      drawer.draw(this.data);
    }else{
      const containerElement = document.querySelector(`#${this.containerHeaderId}`);
      if (containerElement) {
        containerElement.innerHTML = "The goal does not form any conflict with the currently enforced ones and can thus be safely enforced in the next step.";
      } else {
        console.error(`Element with id #${this.containerHeaderId} not found.`);
      }
    }
  }

  private SetContainerId(): void {
    if (this.createUniqueIds()) {
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
    let planProperties: Observable<Record<string, PlanProperty> | undefined> = this.store.select(selectIterativePlanningProperties);
    let result: PlanProperty[] = [];
    planProperties.pipe(take(1)).subscribe(properties => {
      if (properties !== undefined){
        Object.values(properties).forEach((property: PlanProperty) => {
          result.push(property);
        })
      }
    })
    return result;
  }

  private Initialize(): void {
    if (this.answer == null) {
      return;
    }

    // if (this.createUniqueIds && this.property() != null) {
    //   this.answer().forEach((item: string[]) => {
    //     item.push(this.property()._id)
    //   })
    // }

    const planProperties = this.GetStepPlanProperties();

    const ans = this.answer();
    if (ans){
      this.MUGS = ans.map((ids: string[], index: number) => {

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
      this.showVisualization = this.MUGS.length > 0;
      this.data.MUGS = this.MUGS
      this.data.elements = planProperties.filter((prop) => {
        return this.MUGS.some(mug => mug.s.has(prop.name));
      })
    }
  }

  private ComputeOrderDependentValues(): void {
    this.data.counts = {}
    const ans = this.answer();
    if (ans){
      ans.forEach((mugs, i) => {
        mugs.forEach(d=> {
          if (this.data.counts[d]) {
            this.data.counts[d] += 1;
          } else {
            this.data.counts[d] = 1;
          }
        })
      })
    }
  }

  private Sort(): void {
    this.data.elements.sort((a, b) => this.data.counts[a._id] - this.data.counts[b._id]);
    this.data.elements.reverse();
    let list: Record<string, any> = this.data.MUGS;
    this.data.MUGS = this.RecursiveSort(list, 0);
  }

  private RecursiveSort(listToSort: Record<string, any>, i: number): any {
    if (listToSort.length <= 1) {
      return listToSort
    } else {
      listToSort.sort((a: Record<string, any>, b: Record<string, any>) => b.s.has(this.data.elements[i].name) - a.s.has(this.data.elements[i].name));
      let split = listToSort.findIndex((m: { s: { has: (arg0: string) => any; }; }) => !m.s.has(this.data.elements[i].name));
      let temp = listToSort.splice(0,split);
      return this.RecursiveSort(temp, i+1).concat(this.RecursiveSort(listToSort, i+1));
    }
  }


}
