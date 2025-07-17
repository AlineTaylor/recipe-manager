import { Component, Input } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: '../header-footer.component.css',
})
export class HeaderComponent {
  @Input() drawer!: MatDrawer; // take drawer from parent
}
