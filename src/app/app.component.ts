import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [
      RouterOutlet
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'IPEXCO';

  iconReg = inject(MatIconRegistry);

  constructor(){
    this.iconReg.setDefaultFontSetClass('material-symbols-outlined');
  }
}
