import { NgModule } from '@angular/core';

import { PageContentComponent } from './page-content/page-content.component';
import { PageHeroComponent } from './page-hero/page-hero.component';
import { PageSectionContentComponent } from './page-section-content/page-section-content.component';
import { PageSectionListComponent } from './page-section-list/page-section-list.component';
import { PageSectionTitleComponent } from './page-section-title/page-section-title.component';
import { PageSectionComponent } from './page-section/page-section.component';
import { PageTitleActionComponent } from './page-title-action/page-title-action.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { PageComponent } from './page/page.component';

@NgModule({
  imports: [ PageComponent, PageTitleComponent, PageContentComponent, PageTitleActionComponent, PageHeroComponent, PageSectionComponent, PageSectionListComponent, PageSectionTitleComponent, PageSectionContentComponent ],
  exports: [ PageComponent, PageTitleComponent, PageContentComponent, PageTitleActionComponent, PageHeroComponent, PageSectionComponent, PageSectionListComponent, PageSectionTitleComponent, PageSectionContentComponent ],
})
export class PageModule { }
