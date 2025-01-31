import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DomainSpecification } from '../../domain/domain_specification';
import { SpecCardModule } from 'src/app/shared/components/spec-card/spec-card.module';

@Component({
  selector: 'app-domain-spec-card',
  imports: [
        MatIconModule,
        SpecCardModule
  ],
  templateUrl: './domain-spec-card.component.html',
  styleUrl: './domain-spec-card.component.scss'
})
export class DomainSpecCardComponent {

   spec = input.required<DomainSpecification>();

}
