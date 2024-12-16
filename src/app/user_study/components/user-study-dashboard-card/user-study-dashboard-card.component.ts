import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-study-dashboard-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './user-study-dashboard-card.component.html',
  styleUrl: './user-study-dashboard-card.component.scss'
})
export class UserStudyDashboardCardComponent {

  icon = input.required<string>();
  title = input.required<string>();
  value = input.required<string>();

}
