import { NgModule } from '@angular/core';

import { BreadcrumbItemComponent } from './breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';



@NgModule({
  imports: [ BreadcrumbComponent, BreadcrumbItemComponent ],
  exports: [ BreadcrumbComponent, BreadcrumbItemComponent ],
})
export class BreadcrumbModule { }
