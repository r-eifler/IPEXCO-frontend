import { Component } from '@angular/core';

import { SideSheetModule } from 'src/app/shared/component/side-sheet/side-sheet.module';

@Component({
  selector: 'app-create-iteration',
  standalone: true,
  imports: [SideSheetModule],
  templateUrl: './create-iteration.component.html',
  styleUrl: './create-iteration.component.scss'
})
export class CreateIterationComponent {

}
