import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';
import { SpecificationOverviewComponent } from './view/specification-overview/specification-overview.component';
import { DomainSpecEditorComponent } from './view/domain-spec-editor/domain-spec-editor.component';
import { loadDomainSpecResolver } from './resolver/load-domain-spec.resolver';


const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview'
      },
      {
        path: 'overview',
        component: SpecificationOverviewComponent,
      },
      {
        path: 'edit/:domainSpecId',
        resolve: { loadDomainSpecResolver },
        component: DomainSpecEditorComponent,
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class GlobalSpecificationRoutesModule { }
