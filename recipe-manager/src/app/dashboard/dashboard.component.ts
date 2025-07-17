import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    '../shared/layout/sidebar/sidebar.component.css',
  ],
})
export class DashboardComponent {}
