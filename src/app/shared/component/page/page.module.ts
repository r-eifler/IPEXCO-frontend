import { NgModule } from '@angular/core';

import { PageContentComponent } from './page-content/page-content.component';
import { PageHeroComponent } from './page-hero/page-hero.component';
import { PageTitleActionComponent } from './page-title-action/page-title-action.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { PageComponent } from './page/page.component';

@NgModule({
  imports: [ PageComponent, PageTitleComponent, PageContentComponent, PageTitleActionComponent, PageHeroComponent ],
  exports: [ PageComponent, PageTitleComponent, PageContentComponent, PageTitleActionComponent, PageHeroComponent ],
})
export class PageModule { }
