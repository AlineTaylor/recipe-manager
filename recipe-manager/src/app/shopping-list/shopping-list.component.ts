import { Component, computed, effect, inject, signal } from '@angular/core';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { Recipe } from '../shared/utils/recipe.model';
import { SharedModule } from '../shared/shared.module';
import { UnitToggleComponent } from '../shared/layout/unit-toggle/unit-toggle.component';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [SharedModule, UnitToggleComponent],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent {
  unitSystem = signal<'metric' | 'imperial'>('metric');

  // new helper to get converted ingredient qty for display
  getDisplayQty(item: any): { qty: number | null; unit: string } {
    const system = this.unitSystem();
    if (system === 'metric') {
      return { qty: item.metric_qty, unit: item.metric_unit };
    } else {
      return { qty: item.imperial_qty, unit: item.imperial_unit };
    }
  }
  private recipeService = inject(RecipeService);

  shoppingRecipes = signal<Recipe[]>([]);
  shoppingList = computed(() => {
    // flatten all ingredients from recipes flagged for shopping list addition
    const allIngredients = this.shoppingRecipes()
      .filter((r) => r.shopping_list)
      .flatMap((r) =>
        r.ingredient_lists.map((ing) => ({
          ...ing,
          recipe: r,
        }))
      );

    // aggregate by ingredient_id and unit
    const aggregateMap = new Map<string, any>();
    for (const ing of allIngredients) {
      // use ingredient_id and metric_unit (for now) as key
      const key = `${ing.ingredient_id || ing.ingredient?.id || ''}|${
        ing.metric_unit || ''
      }`;
      if (aggregateMap.has(key)) {
        const existing = aggregateMap.get(key);
        existing.metric_qty += ing.metric_qty || 0;
        // aggregate imperial_qty if units match
        if (ing.imperial_unit && existing.imperial_unit === ing.imperial_unit) {
          existing.imperial_qty += ing.imperial_qty || 0;
        }
      } else {
        // clone to avoid changing original!!!
        aggregateMap.set(key, { ...ing });
      }
    }
    return Array.from(aggregateMap.values());
  });

  constructor() {
    this.loadShoppingRecipes();

    // watch shopping list and reload when something changes
    effect(() => {
      this.recipeService.shoppingListChanged();
      this.loadShoppingRecipes();
    });
  }

  private loadShoppingRecipes() {
    this.recipeService.getShoppingListRecipes().subscribe((recipes) => {
      this.shoppingRecipes.set(recipes);
    });
  }

  removeFromShoppingList(recipe: Recipe) {
    this.recipeService.toggleShoppingList(recipe);
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
