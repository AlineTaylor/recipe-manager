import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: '../header-footer.component.css',
})
export class HeaderComponent {}
