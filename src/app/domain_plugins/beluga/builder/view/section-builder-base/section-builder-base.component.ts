import { Component, inject } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { StateGridComponent } from '../../components/state-grid/state-grid.component';
import { selectTask } from '../../state/builder.feature';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-section-builder-base',
  imports: [
      PageModule,
      TranslocoModule,
      StateGridComponent,
      BreadcrumbModule,
      MatIconModule,
      RouterLink,
    ],
  providers: [
      provideTranslocoScope({
        scope: "builder",
        alias: "b",
      }),
  ],
  templateUrl: './section-builder-base.component.html',
  styleUrl: './section-builder-base.component.scss'
})
export class SectionBuilderBaseComponent {

    store = inject(Store);
  
    task$ = this.store.select(selectTask);

    constructor(){
      console.log("SectionBuilderBaseComponent")
    }

}
