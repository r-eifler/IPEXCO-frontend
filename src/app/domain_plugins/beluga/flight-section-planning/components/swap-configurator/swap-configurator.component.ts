import { Component, effect, input, output, signal, WritableSignal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-swap-configurator',
  imports: [
    MatSliderModule,
  ],
  templateUrl: './swap-configurator.component.html',
  styleUrl: './swap-configurator.component.scss'
})
export class SwapConfiguratorComponent {

  value = input.required<number>();
  disabled = input<false>();
  valueChange = output<number>();

  currentValue: WritableSignal<string> = signal('?')

  onValueChanged(v: number){
    this.valueChange.emit(v);
    this.currentValue.set(v.toString());
  }
  
  constructor(){
    effect(() => this.currentValue.set(this.value() !== null ? this.value()?.toString() : '?'))
  }

  formatLabel(value: number){
    return value.toString()
  }
}
