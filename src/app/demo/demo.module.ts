import { NgModule } from '@angular/core';
import { DemoRoutesModule } from './demo.routes.module';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DemoLoadPromptsEffect } from './state/effects/load-prompts.effect';
import { DemoLoadServicesEffect } from './state/effects/load-services.effect';
import { DemoExplainerServicesService } from './services/explainer.service';
import { DemoPlannerServicesService } from './services/planner.service';
import { DemoPromptsService } from './services/prompts.service';
import { demosFeature } from './state/demo.feature';
import { DemoService } from './services/demo.service';
import { DemoPlanPropertyService } from './services/plan-properties.service';


@NgModule({
  declarations: [],
  imports: [
    DemoRoutesModule,
    StoreModule.forFeature(demosFeature),
    EffectsModule.forFeature([
      DemoLoadPromptsEffect,
      DemoLoadServicesEffect
    ]),
  ],
  providers: [
    DemoService,
    DemoPlanPropertyService,
    DemoExplainerServicesService,
    DemoPlannerServicesService,
    DemoPromptsService
  ]
})
export class DemoModule { }
