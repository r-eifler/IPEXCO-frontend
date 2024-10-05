import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-content',
  standalone: true,
  templateUrl: './page-content.component.html',
  styleUrl: './page-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContentComponent {

}
