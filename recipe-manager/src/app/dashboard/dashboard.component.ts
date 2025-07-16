import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from '../shared/layout/sidebar/sidebar.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    '../shared/layout/sidebar/sidebar.component.css',
  ],
})
export class DashboardComponent {}
