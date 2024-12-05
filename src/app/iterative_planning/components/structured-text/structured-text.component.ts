import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExplanationMessage } from '../../domain/interface/explanation-message';
import { PlanProperty } from '../../../shared/domain/plan-property/plan-property';

@Component({
  selector: 'app-structured-text',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './structured-text.component.html',
  styleUrl: './structured-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructuredTextComponent {
  message = input.required<ExplanationMessage>();
  properties = input.required<Record<string, PlanProperty>>();
}
