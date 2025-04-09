import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { OutputSchema } from '../../domain/prompt';
import { SpecCardModule } from 'src/app/shared/components/spec-card/spec-card.module';

@Component({
  selector: 'app-output-schema-card',
  imports: [
    MatIconModule,
    SpecCardModule
  ],
  templateUrl: './output-schema-card.component.html',
  styleUrl: './output-schema-card.component.scss'
})
export class OutputSchemaCardComponent {

  schema = input.required<OutputSchema>();
  domains = input.required<{_id: string, name: string}[]>();
  explainer = input.required<{_id: string, name: string}[]>();

  domainName = computed(() => this.domains()?.filter(e => e._id == this.schema().domain)[0].name)
  explainerName = computed(() => this.explainer()?.filter(e => e._id == this.schema().explainer)[0].name)

}
