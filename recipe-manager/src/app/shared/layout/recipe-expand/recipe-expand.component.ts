import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Recipe } from '../../utils/recipe.model';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { RecipeService } from '../../utils/services/recipe.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipe-expand',
  standalone: true,
  imports: [SharedModule, MatDividerModule],
  templateUrl: './recipe-expand.component.html',
  styleUrl: './recipe-expand.component.css',
})
export class RecipeExpandComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public recipe: Recipe,
    private dialogRef: MatDialogRef<RecipeExpandComponent>,
    private router: Router,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

  close() {
    this.dialogRef.close();
  }

  editRecipe() {
    this.dialogRef.close();
    this.router.navigate(['/recipe-editor', this.recipe.id]);
  }

  deleteRecipe() {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    this.recipeService.deleteRecipe(this.recipe.id).subscribe({
      next: () => {
        this.snackBar.open('Recipe deleted 🗑️', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.dialogRef.close(true); // option to refresh the list
      },
      error: () => {
        this.snackBar.open(
          'Failed to delete recipe. Please try again.',
          'Dismiss',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });
  }
}
