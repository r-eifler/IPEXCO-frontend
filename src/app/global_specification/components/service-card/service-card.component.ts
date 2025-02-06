import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SpecCardModule } from 'src/app/shared/components/spec-card/spec-card.module';
import { Service, ServiceType } from '../../domain/services';

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
  domains = input.required<{_id: string, name: string}[]>();

  type_icon_mapping = {
    [ServiceType.PLANNER]: 'explore',
    [ServiceType.EXPLAINER]: 'contact_support',
    [ServiceType.TESTER]: 'bug_report',
    [ServiceType.VERIFIER]: 'verified',
    [ServiceType.PROPERTY_CHECKER]: 'check'
  }

  domainName = computed(() => this.domains()?.find(e => e._id == this.service().domainId).name);
  apiKey = computed(() => this.service()?.apiKey?.replace(/./g, '*'));
  icon = computed(() => this.type_icon_mapping[this.service()?.type])

}
