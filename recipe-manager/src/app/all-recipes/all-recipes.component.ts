import { Component, Input } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Recipe } from '../shared/utils/recipe.model';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.css',
})
export class AllRecipesComponent {
  @Input({ required: true }) recipes: Recipe[] = [];
}
