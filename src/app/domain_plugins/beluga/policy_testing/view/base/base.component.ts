import { Component } from '@angular/core';
import { PageModule } from 'src/app/shared/components/page/page.module';

@Component({
  selector: 'app-base',
  imports: [
    PageModule
  ],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {

}
