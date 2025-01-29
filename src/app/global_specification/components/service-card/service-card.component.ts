import { Component, computed, input } from '@angular/core';
import { Service } from '../../domain/services';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-service-card',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {

  service = input.required<Service>();
  type = input.required<'planner' | 'explainer'>();
  domains = input.required<{_id: string, name: string}[]>();

  domainName = computed(() => this.domains()?.filter(e => e._id == this.service().domainId)[0].name)

}
