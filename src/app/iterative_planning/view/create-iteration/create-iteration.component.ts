import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { InfoModule } from 'src/app/shared/component/info/info.module';
import { SideSheetModule } from 'src/app/shared/component/side-sheet/side-sheet.module';

@Component({
  selector: 'app-create-iteration',
  standalone: true,
  imports: [SideSheetModule, InfoModule, MatIconModule],
  templateUrl: './create-iteration.component.html',
  styleUrl: './create-iteration.component.scss'
})
export class CreateIterationComponent {

}
