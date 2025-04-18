import { Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Jig, JigType } from '../../domain/beluga_problem';

@Component({
  selector: 'app-jig',
  imports: [
    MatTooltipModule,
  ],
  templateUrl: './jig.component.html',
  styleUrl: './jig.component.scss'
})
export class JigComponent {

  jig = input.required<Jig>()
  jigType = input.required<JigType>()

  unitSize = input<boolean>(false);

  name = computed(() => this.jig()?.name.replace('jig',''))

  jigSize = computed(() => this.jigType()?.size_empty)
  partSize = computed(() => this.jigType()?.size_loaded)

  loaded = computed(() => ! this.jig()?.empty)

  tooltip = computed(() => 
    "status: " + (this.jig()?.empty ? 'empty' : 'loaded') +
    ' size: ' + (this.jig()?.empty ? this.jigType()?.size_empty : this.jigType()?.size_loaded) +
    ' type: ' + this.jig()?.type
  )
}
