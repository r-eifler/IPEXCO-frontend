import { NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { selectSizeUnit } from '../../../builder/state/builder.selector';
import { Jig, JigType } from '../../domain/beluga_problem';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-jig',
  imports: [
    MatTooltipModule,
    NgClass,
    MatIconModule,
    OverlayModule,
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

  status = computed(() => this.jig()?.empty ? 'empty' : 'loaded');
  size = computed(() => this.jig()?.empty ? this.jigType()?.size_empty : this.jigType()?.size_loaded);
  type = computed(() => this.jig()?.type);
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

  isOpen = false;

}
