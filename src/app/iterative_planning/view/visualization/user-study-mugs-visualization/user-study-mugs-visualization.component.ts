import {Component, input} from '@angular/core';
import {PlanProperty} from '../../../../shared/domain/plan-property/plan-property';
import {PageComponent} from '../../../../shared/components/page/page/page.component';
import {PageSectionComponent} from '../../../../shared/components/page/page-section/page-section.component';
import * as setchart from "./helpers/setchart.js"
import {IDataObject} from './Types/IDataObject';

@Component({
  selector: 'app-user-study-mugs-visualization',
  templateUrl: './user-study-mugs-visualization.component.html',
  styleUrls: ['./user-study-mugs-visualization.component.scss'],
  imports: [
    PageComponent,
    PageSectionComponent
  ],
  standalone: true
})

export class UserStudyMugsVisualizationComponent {
  answer = input.required<PlanProperty[][] | null>();

  containerHeaderId: string = "mugs-vis";
  MUGS: Record<string, any>[] = []
  elements: PlanProperty[] = [];
  data: IDataObject;

  ngOnInit(): void {
    this.CheckContainer();
    this.Initialize();
    setchart.init(this.containerHeaderId, this.MUGS.length, this.elements.length);
    setchart.draw(this.data);
  }


  private CheckContainer() :void {
    const container = document.querySelector(this.containerHeaderId);
    if (!container) {
      throw new Error(`Container with ID "${this.containerHeaderId}" not found.`);
    }
  }

  private Initialize(): void {
    if (this.answer == null) {
      return;
    }

    // Init set of MUGS
    this.MUGS = this.answer().map((mugs: PlanProperty[], index: number) => {
      return {
        index,
        l: mugs.map(mug => mug.name),
        s: new Set(mugs.map(mug => mug.name))
      }
    })

    // Init Unique PlanProperty
    this.elements = this.answer()
      .flat()
      .filter((value: PlanProperty, index: number, self: PlanProperty[]): boolean =>
        index === self.findIndex((prop: PlanProperty): boolean => prop._id === value._id)
      );

    // Construct dataset
    this.data.MUGS = this.MUGS
    this.data.elements = this.elements
  }

}
