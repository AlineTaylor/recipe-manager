import { Component, computed, effect, inject, signal } from '@angular/core';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { Recipe, IngredientList } from '../shared/utils/recipe.model';
import { SharedModule } from '../shared/shared.module';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';

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
  shoppingList = computed(() => {
    return this.shoppingRecipes()
      .filter((r) => r.shopping_list)
      .flatMap((r) =>
        r.ingredient_lists.map((ing) => ({
          ...ing,
          recipe: r,
        }))
      );
  });

  constructor() {
    // Load initial data
    this.loadShoppingRecipes();

    // React to changes in shopping list
    effect(() => {
      this.recipeService.shoppingListChanged();
      this.loadShoppingRecipes(); // reload when something changes
    });
  }

  private loadShoppingRecipes() {
    this.recipeService.getShoppingListRecipes().subscribe((recipes) => {
      this.shoppingRecipes.set(recipes);
    });
  }

  removeFromShoppingList(recipe: Recipe) {
    this.recipeService.toggleShoppingList(recipe); // you already have this!
  }

  //sharing button group
  readonly dialog = inject(MatDialog);
  emailSharingComponent = EmailSharingComponent;
  openDialog(
    component: ComponentType<any>,
    type: 'favorites' | 'recently-viewed' | 'results'
  ) {
    this.dialog.open(component, {
      data: { type },
    });
  }

  //print functionality
  printPage() {
    window.print();
  }
}
