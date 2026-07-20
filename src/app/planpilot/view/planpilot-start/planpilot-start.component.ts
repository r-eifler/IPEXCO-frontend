import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { Project } from 'src/app/shared/domain/project';

@Component({
  selector: 'app-planpilot-start',
  imports: [AsyncPipe, BreadcrumbModule, MatButtonModule, MatIconModule, PageModule, RouterLink],
  templateUrl: './planpilot-start.component.html',
  styleUrl: './planpilot-start.component.scss',
})
export class PlanPilotStartComponent {
  readonly project$ = inject(ActivatedRoute).data.pipe(
    map((data) => data['project'] as Project),
  );
}
