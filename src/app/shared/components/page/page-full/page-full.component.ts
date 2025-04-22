import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-full',
  standalone: true,
  templateUrl: './page-full.component.html',
  styleUrl: './page-full.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageFullComponent {

}
