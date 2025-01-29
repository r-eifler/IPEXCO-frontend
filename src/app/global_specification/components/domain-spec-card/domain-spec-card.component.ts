import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DomainSpecification } from '../../domain/domain_specification';

@Component({
  selector: 'app-domain-spec-card',
  imports: [
        MatCardModule,
        MatIconModule,
        MatChipsModule
  ],
  templateUrl: './domain-spec-card.component.html',
  styleUrl: './domain-spec-card.component.scss'
})
export class DomainSpecCardComponent {

   spec = input.required<DomainSpecification>();

}
