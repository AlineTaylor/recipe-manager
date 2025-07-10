import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from '../shared/layout/sidebar/sidebar.component';
@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule, MatButtonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    '../shared/layout/sidebar/sidebar.component.css',
  ],
})
export class DashboardComponent {}
