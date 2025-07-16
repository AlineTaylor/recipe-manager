import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent {}
