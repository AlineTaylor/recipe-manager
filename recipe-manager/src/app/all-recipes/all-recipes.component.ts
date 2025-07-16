import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.css',
})
export class AllRecipesComponent {}
