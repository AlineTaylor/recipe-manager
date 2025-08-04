import { Component, computed, inject, signal } from '@angular/core';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { Recipe, IngredientList } from '../shared/utils/recipe.model';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent {
  private recipeService = inject(RecipeService);

  shoppingRecipes = signal<Recipe[]>([]);
  shoppingList = computed<IngredientList[]>(() => {
    return this.shoppingRecipes()
      .flatMap((recipe) => recipe.ingredient_lists)
      .filter((ing) => ing != null); // Optional in case of empty/null
  });

  constructor() {
    this.recipeService.getShoppingListRecipes().subscribe((recipes) => {
      this.shoppingRecipes.set(recipes);
    });
  }
}
