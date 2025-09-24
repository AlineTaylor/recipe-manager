import { Component, computed, effect, inject, signal } from '@angular/core';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { Recipe } from '../shared/utils/recipe.model';
import { SharedModule } from '../shared/shared.module';
import { UnitToggleComponent } from '../shared/layout/unit-toggle/unit-toggle.component';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';
import { getDisplayQty } from '../shared/utils/get-display-qty';
import { persistentSignal } from '../shared/persistent-signal';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [SharedModule, UnitToggleComponent],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent {
  unitSystem = signal<'metric' | 'imperial'>('metric');

  // expose helper for template with current system
  getQty(item: any) {
    return getDisplayQty(item, this.unitSystem());
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

  // persist a list of excluded ingredient keys so users can hide individual items
  private excludedKeys = persistentSignal<string[]>('shopping-excluded', []);

  private makeKey(item: any): string {
    const ingId = item.ingredient_id || item.ingredient?.id || '';
    const unitKey = item.metric_unit || item.imperial_unit || '';
    return `${ingId}|${unitKey}`;
  }

  isExcluded(item: any): boolean {
    const key = this.makeKey(item);
    return this.excludedKeys().includes(key);
  }

  toggleIngredient(item: any) {
    const key = this.makeKey(item);
    const list = this.excludedKeys();
    if (list.includes(key)) {
      this.excludedKeys.set(list.filter((k) => k !== key));
    } else {
      this.excludedKeys.set([...list, key]);
    }
  }

  // underlying recipe selection remains unchanged while maintianng excluded items
  visibleShoppingList = computed(() =>
    this.shoppingList().filter((item) => !this.isExcluded(item))
  );

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
    type: 'favorites' | 'latest' | 'results' | 'shopping-list'
  ) {
    // pass the current shopping list as dialog data
    const data: any = { type };
    if (type === 'shopping-list') {
      data.shoppingList = this.visibleShoppingList();
    }
    this.dialog.open(component, { data });
  }

  //print functionality
  printPage() {
    window.print();
  }
}
