import { Component, computed, effect, inject, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Jig, JigType } from '../../domain/beluga_problem';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectSizeUnit } from '../../../builder/state/builder.selector';
import { startDrag } from '../../../builder/state/builder.actions';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-jig',
  imports: [
    MatTooltipModule,
    NgClass
  ],
  templateUrl: './jig.component.html',
  styleUrl: './jig.component.scss'
})
export class JigComponent {

  store = inject(Store);
  sizeUnit = toSignal(this.store.select(selectSizeUnit));

  jig = input.required<Jig>()
  jigType = input.required<JigType>()

  draggable = input<boolean>(false);
  unitSize = input<boolean>(false);

  name = computed(() => this.jig()?.name?.replace('jig',''))

  jigSize = computed(() => this.jigType()?.size_empty)
  partSize = computed(() => this.jigType()?.size_loaded)

  jigDisplaySize = computed(() => (this.unitSize() ?? false) ? 55 : this.jigSize() * (this.sizeUnit() ?? 10))
  partDisplaySize = computed(() => (this.unitSize() ?? false) ? 55 : this.partSize() * (this.sizeUnit() ?? 10))

  loaded = computed(() => ! this.jig()?.empty)

  tooltip = computed(() => 
    "status: " + (this.jig()?.empty ? 'empty' : 'loaded') +
    ' size: ' + (this.jig()?.empty ? this.jigType()?.size_empty : this.jigType()?.size_loaded) +
    ' type: ' + this.jig()?.type
  )

  isHovering =  false;

  onHover() {
    this.isHovering = true;
  }

  onMouseOut() {
    this.isHovering = false;
  }

}
