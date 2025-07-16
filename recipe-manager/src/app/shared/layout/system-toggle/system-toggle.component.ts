import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-system-toggle',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './system-toggle.component.html',
  styleUrls: ['./system-toggle.component.css'],
})
export class SystemToggleComponent {}
