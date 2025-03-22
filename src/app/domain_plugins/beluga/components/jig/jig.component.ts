import { Component, computed, effect, input } from '@angular/core';
import { Jig, JigType } from '../../domain/beluga_problem';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-jig',
  imports: [
    MatTooltipModule
  ],
  templateUrl: './jig.component.html',
  styleUrl: './jig.component.scss'
})
export class JigComponent {

  jig = input.required<Jig>()
  jigType = input.required<JigType>()

  name = computed(() => this.jig()?.name.replace('jig',''))

  size = computed(() => this.jig()?.empty ? this.jigType()?.size_empty : this.jigType()?.size_loaded)

  tooltip = computed(() => "status: " + (this.jig()?.empty ? 'empty' : 'loaded') + 
  ' size: ' + (this.jig()?.empty ? this.jigType()?.size_empty : this.jigType()?.size_loaded) )

}
