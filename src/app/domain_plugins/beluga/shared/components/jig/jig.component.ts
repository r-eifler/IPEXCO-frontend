import { NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { selectSizeUnit } from '../../../builder/state/builder.selector';
import { Jig, JigType } from '../../domain/beluga_problem';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-jig',
  imports: [
    MatTooltipModule,
    NgClass,
    MatIconModule,
    OverlayModule,
    MatListModule,
  ],
  templateUrl: './jig.component.html',
  styleUrl: './jig.component.scss'
})
export class JigComponent {

  jig = input.required<Jig | null>()
  jigType = input.required<JigType>()
  incomingFlight = input<string | undefined | null>(undefined)


  sizeUnit = input<number>(15)

  draggable = input<boolean>(false);
  showTooltip = input<boolean>(true);
  unitSize = input<boolean>(false);
  showOnlyPart = input<boolean>(false);

  name = computed(() => this.jig()?.name?.replace('jig',''))

  jigSize = computed(() => this.jigType()?.size_empty)
  partSize = computed(() => this.jigType()?.size_loaded)

  jigDisplaySize = computed(() => (this.unitSize() ?? false) ? 55 : this.jigSize() * (this.sizeUnit() ?? 10))
  partDisplaySize = computed(() => (this.unitSize() ?? false) ? 55 : this.partSize() * (this.sizeUnit() ?? 10))

  loaded = computed(() => this.jig() === null ? false : ! this.jig()?.empty)

  status = computed(() => this.jig()?.empty ? 'empty' : 'loaded');
  size = computed(() => this.jig()?.empty ? this.jigType()?.size_empty : this.jigType()?.size_loaded);
  sizeEmpty = computed(() => this.jigType()?.size_empty);
  sizeLoaded = computed(() => this.jigType()?.size_loaded);
  type = computed(() => this.jigType()?.name);
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
