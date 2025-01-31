import { NgModule } from '@angular/core';
import { SpecCardComponent } from './spec-card/spec-card.component';
import { SpecCardFeatureComponent } from './spec-card-feature/spec-card-feature.component';
import { SpecCardTitleComponent } from './spec-card-title/spec-card-title.component';
import { SpecCardSubTitleComponent } from './spec-card-sub-title/spec-card-sub-title.component';




@NgModule({
  imports: [
    SpecCardComponent,
    SpecCardFeatureComponent,
    SpecCardTitleComponent,
    SpecCardSubTitleComponent
  ],
  exports: [
    SpecCardComponent,
    SpecCardFeatureComponent,
    SpecCardTitleComponent,
    SpecCardSubTitleComponent
  ],
})
export class SpecCardModule { }
