import { Component, Inject, signal, WritableSignal } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Recipe } from '../../utils/recipe.model';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { RecipeService } from '../../utils/services/recipe.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnitToggleComponent } from '../unit-toggle/unit-toggle.component';
import { convertUnits } from '../../utils/convert-units';

@Component({
  selector: 'app-recipe-expand',
  standalone: true,
  imports: [SharedModule, MatDividerModule, UnitToggleComponent],
  templateUrl: './recipe-expand.component.html',
  styleUrl: './recipe-expand.component.css',
})
export class RecipeExpandComponent {
  // helper to get converted ingredient value
  getConvertedIngredient(ing: any): { qty: number | null; unit: string } {
    const system = this.unitSystem();
    if (system === 'metric') {
      if (ing.metric_qty && ing.metric_unit) {
        return { qty: ing.metric_qty, unit: ing.metric_unit };
      } else if (ing.imperial_qty && ing.imperial_unit) {
        const converted = convertUnits(
          ing.imperial_qty,
          ing.imperial_unit,
          'g'
        );
        return { qty: converted, unit: 'g' };
      }
    } else {
      if (ing.imperial_qty && ing.imperial_unit) {
        return { qty: ing.imperial_qty, unit: ing.imperial_unit };
      } else if (ing.metric_qty && ing.metric_unit) {
        const converted = convertUnits(ing.metric_qty, ing.metric_unit, 'oz');
        return { qty: converted, unit: 'oz' };
      }
    }
    return { qty: null, unit: '' };
  }
  unitSystem = signal<'metric' | 'imperial'>('metric');
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
