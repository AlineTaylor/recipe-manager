import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HeroComponent } from '../shared/layout/hero/hero.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SharedModule, HeroComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {}
