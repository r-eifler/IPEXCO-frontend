import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageContentComponent } from './page-content/page-content.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { PageComponent } from './page/page.component';



@NgModule({
  declarations: [ PageComponent, PageTitleComponent, PageContentComponent],
  imports: [ CommonModule ],
  exports: [ PageComponent, PageTitleComponent, PageContentComponent],
})
export class PageModule { }
