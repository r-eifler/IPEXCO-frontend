import { Component, computed, input } from '@angular/core';
import { Service } from '../../domain/services';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { SpecCardModule } from 'src/app/shared/components/spec-card/spec-card.module';

@Component({
  selector: 'app-service-card',
  imports: [
    MatIconModule,
    SpecCardModule
  ],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {

  service = input.required<Service>();
  type = input.required<'planner' | 'explainer'>();
  domains = input.required<{_id: string, name: string}[]>();

  domainName = computed(() => this.domains()?.find(e => e._id == this.service().domainId).name);
  apiKey = computed(() => this.service()?.apiKey?.replace(/./g, '*'));

}
