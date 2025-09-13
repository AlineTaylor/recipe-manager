import { Component, inject, Input, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from '../shared/utils/services/share.service';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-email-sharing-component',
  imports: [SharedModule],
  templateUrl: './email-sharing.component.html',
  styleUrl: './email-sharing.component.css',
})
export class EmailSharingComponent {
  private recipeService = inject(RecipeService);
  public shareService = inject(ShareService);
  public dialogRef = inject(MatDialogRef<EmailSharingComponent>);

  recipes = signal<any[]>([]);
  constructor() {
    const dialogData = inject(MAT_DIALOG_DATA, { optional: true });
    if (dialogData && dialogData.type) {
      this.type = dialogData.type;
    }
    // Handle recipes based on type
    if (this.type === 'favorites') {
      this.recipeService.getFavoriteRecipes().subscribe((recipes) => {
        this.recipes.update(() => recipes);
      });
    } else if (this.type === 'latest') {
      // latestRecipes is a signal, copy its value into our writable signal
      this.recipes.update(() => this.recipeService.latestRecipes());
    } else if (this.type === 'results' && dialogData && dialogData.recipes) {
      // results passed in as dialog data
      this.recipes.update(() => dialogData.recipes);
    }
  }

  // Use the tag to decide which data to pull
  // TODO - remember to update types
  @Input()
  type: 'favorites' | 'latest' | 'results' = 'favorites';

  // recipes signal is set in constructor

  toggleForm() {
    this.shareService.toggleShareForm();
  }

  emailMessage() {
    // Log the recipes to verify correct data
    console.log('Recipes to share:', this.recipes());
    this.shareService.resetShareForm();
    this.dialogRef.close();
  }
}
