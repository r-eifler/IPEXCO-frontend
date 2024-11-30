import { Component, OnInit } from '@angular/core';
import { MugsVisualizationBaseComponent } from 'src/app/iterative_planning/view/visualization/mugs-visualization-base/mugs-visualization-base.component';
import { MUGSVisuMainComponent } from '../mugs-visu-main/mugs-visu-main.component';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-conflict-visu-container',
  standalone: true,
  imports: [
    MUGSVisuMainComponent,
    MatCardModule,
    AsyncPipe,
  ],
  templateUrl: './conflict-visu-container.component.html',
  styleUrls: ['./conflict-visu-container.component.scss']
})
export class ConflictVisuContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
