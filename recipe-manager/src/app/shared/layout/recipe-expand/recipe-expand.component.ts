import { Component, Inject, signal, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Recipe } from '../../utils/recipe.model';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { RecipeService } from '../../utils/services/recipe.service';
import { NotificationService } from '../../utils/services/notification.service';
import { UnitToggleComponent } from '../unit-toggle/unit-toggle.component';
import { getDisplayQty } from '../../utils/get-display-qty';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../../../email-sharing/email-sharing.component';
import { ComponentType } from '@angular/cdk/overlay';

@Component({
  selector: 'app-recipe-expand',
  standalone: true,
  imports: [SharedModule, MatDividerModule, UnitToggleComponent],
  templateUrl: './recipe-expand.component.html',
  styleUrl: './recipe-expand.component.css',
})
export class RecipeExpandComponent {
  //new helper method for displaying converted qty
  public getDisplayQty = getDisplayQty;
  unitSystem = signal<'metric' | 'imperial'>('metric');
  readonly dialog = inject(MatDialog);
  emailSharingComponent = EmailSharingComponent;
  private notifications = inject(NotificationService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public recipe: Recipe,
    private dialogRef: MatDialogRef<RecipeExpandComponent>,
    private router: Router,
    private recipeService: RecipeService
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
        this.notifications.success('Recipe deleted 🗑️');
        this.dialogRef.close(true); // option to refresh the list
      },
      error: () => {
        this.notifications.error('Failed to delete recipe. Please try again.');
      },
    });
  }

  openDialog(
    component: ComponentType<any>,
    type: 'favorites' | 'latest' | 'results'
  ) {
    // pass individual recipes as results
    this.dialog.open(component, {
      data: { type: 'results', recipes: [this.recipe] },
    });
  }

  printPage() {
    window.print();
  }
}
