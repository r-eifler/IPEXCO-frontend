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

  isOpen = false;

  jig = input.required<Jig>()
  jigType = input.required<JigType>()

  name = computed(() => this.jig()?.name.replace('jig',''))

  size = computed(() => this.jig()?.empty ? this.jigType()?.size_empty : this.jigType()?.size_loaded)

  tooltip = computed(() => 
    "status: " + (this.jig()?.empty ? 'empty' : 'loaded') +
    ' size: ' + (this.jig()?.empty ? this.jigType()?.size_empty : this.jigType()?.size_loaded) +
    ' type: ' + this.jig()?.type
  )

  showOverlay(status: boolean){
    this.isOpen = status
  }

}
