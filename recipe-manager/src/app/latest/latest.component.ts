import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.css',
})
export class LatestComponent {}
