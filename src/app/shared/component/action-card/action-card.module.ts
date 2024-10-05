import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ActionCardComponent } from "./action-card/action-card.component";

@NgModule({
  imports: [ActionCardComponent, CommonModule],
  exports: [ActionCardComponent],
})
export class ActionCardModule { }
