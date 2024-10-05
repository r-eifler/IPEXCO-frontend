import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-title',
  standalone: true,
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {

}
