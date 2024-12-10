import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page',
  standalone: true,
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {

}
