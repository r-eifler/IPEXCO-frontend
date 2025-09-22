import { Component, computed, effect, input, output, signal, WritableSignal } from '@angular/core';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-swap-configurator',
  imports: [
    MatSliderModule,
    MatSlideToggleModule
  ],
  templateUrl: './swap-configurator.component.html',
  styleUrl: './swap-configurator.component.scss'
})
export class SwapConfiguratorComponent {

  value = input.required<number | null>();
  disabled = input<false>();
  valueChange = output<number | null>();

  currentValue: WritableSignal<string> = signal('?')

  hasValue = computed(() => this.value() !== null)

  onValueChanged(v: number){
    this.valueChange.emit(v);
    this.currentValue.set(v.toString());
  }

  onLimitChange(event: MatSlideToggleChange){
    if(event.checked){
       this.valueChange.emit(0);
      this.currentValue.set('0');
    }
    else{
      this.valueChange.emit(null);
      this.currentValue.set('inf');
    }
    
  }
  
  constructor(){
    effect(() => {
      const currentValue = this.value();
       if(currentValue === undefined){
        return undefined;
      }
      if(currentValue === null){
        this.currentValue.set('inf');
        return;
      }
      this.currentValue.set(currentValue.toString())
    })
  }

  formatLabel(value: number){
    return value.toString()
  }
}
