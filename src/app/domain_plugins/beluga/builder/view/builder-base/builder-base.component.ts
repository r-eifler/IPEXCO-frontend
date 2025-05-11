import { Component, inject } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { StateGridComponent } from '../../components/state-grid/state-grid.component';
import { selectSightSetUp } from '../../state/builder.selector';

@Component({
  selector: 'app-builder-base',
  imports: [
    PageModule,
    TranslocoModule,
    StateGridComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: "builder",
      alias: "b",
    }),
  ],
  templateUrl: './builder-base.component.html',
  styleUrl: './builder-base.component.scss'
})
export class BuilderBaseComponent {

  store = inject(Store);

  task$ = this.store.select(selectSightSetUp);

}
