import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { Jig, JigType } from '../../domain/beluga_problem';
import { JigStatusComponent } from '../jig-status/jig-status.component';

@Component({
  selector: 'app-production-line',
  imports: [
    TranslocoModule,
    MatIconModule,
    MatCardModule,
    InfoComponent,
    JigStatusComponent,
  ],
   providers: [
      provideTranslocoScope({
        scope: "shared",
        alias: "s",
      }),
    ],
  templateUrl: './production-line.component.html',
  styleUrl: './production-line.component.scss'
})
export class ProductionLineComponent {

  line = input.required<{name: string, schedule: Jig[]}>();
  delivered = input.required<string[]>();
  jigTypes = input.required<Record<string,JigType>>();

  remainingJigs = computed(() => this.line().schedule.filter(j => !this.delivered()?.includes(j.name)))

  lineName = computed(() => this.line()?.name.replace('pl',''))
  jigNames = computed(() => this.remainingJigs().map(j => j.name.replace('jig', '')))

}
