import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Recipe } from '../../utils/recipe.model';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

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
    private router: Router
  ) {}

  close() {
    this.dialogRef.close();
  }

  editRecipe() {
    this.dialogRef.close();
    this.router.navigate(['/recipe-editor', this.recipe.id]);
  }

  deleteRecipe() {
    // TODO: hook up delete here
    console.log('Delete this recipe:', this.recipe.id);
    this.dialogRef.close();
  }
}
