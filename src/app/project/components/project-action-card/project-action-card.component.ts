import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-project-action-card',
    imports: [MatCardModule, MatButtonModule],
    templateUrl: './project-action-card.component.html',
    styleUrl: './project-action-card.component.scss'
})
export class ProjectActionCardComponent {

}
