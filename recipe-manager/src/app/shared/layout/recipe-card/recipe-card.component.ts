import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { SharedModule } from '../../shared.module';
import { Recipe } from '../../utils/recipe.model';
import { RecipeExpandComponent } from '../recipe-expand/recipe-expand.component';
import { MatDialog } from '@angular/material/dialog';
import { RecipeService } from '../../utils/services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCardComponent {
  readonly dialog = inject(MatDialog);
  recipeService = inject(RecipeService);
  @Input() recipe!: Recipe;

  //expand recipe view
  expandRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(RecipeExpandComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: recipe,
      panelClass: 'recipe-expand',
    });

    //refresh recipe list when a recipe is deleted from exp view - removed logic for now after moving it al of parent component
    // dialogRef.afterClosed().subscribe((wasDeleted) => {
    //   if (wasDeleted) {
    //     this.loadRecipes();
    //   }
    // });
  }

  //favoriting logic
  toggleFavorite(recipe: Recipe) {
    this.recipeService.toggleFavorite(recipe);
    // this.recipeService.addToRecentlyViewed(recipe);
  }

  isFavorited(recipe: Recipe): boolean {
    return this.recipeService.isFavorited(recipe);
  }
}
