import { Component, computed, input } from '@angular/core';
import { Jig } from '../../domain/beluga_problem';

@Component({
  selector: 'app-jig',
  imports: [],
  templateUrl: './jig.component.html',
  styleUrl: './jig.component.scss'
})
export class JigComponent {

  jig = input.required<Jig>()

  name = computed(() => this.jig()?.name.replace('jig',''))

}
