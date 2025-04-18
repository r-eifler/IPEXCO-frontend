import { Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';



export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      providers: [
      ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview'
      },
      // {
      //   path: 'overview',
      //   component: SpecificationOverviewComponent,
      // }
    ]
  }
];
