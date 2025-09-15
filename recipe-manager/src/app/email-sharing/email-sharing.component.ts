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
    // Handle recipes or shopping list based on type
    if (this.type === 'favorites') {
      this.recipeService.getFavoriteRecipes().subscribe((recipes) => {
        this.recipes.update(() => recipes);
      });
    } else if (this.type === 'latest') {
      // copy latestRecipes signal value into writable signal
      this.recipes.update(() => this.recipeService.latestRecipes());
    } else if (this.type === 'results' && dialogData && dialogData.recipes) {
      // results passed in as dialog data
      this.recipes.update(() => dialogData.recipes);
    } else if (
      this.type === 'shopping-list' &&
      dialogData &&
      dialogData.shoppingList
    ) {
      // shopping list passed in as dialog data
      this.recipes.update(() => dialogData.shoppingList);
    }
  }

  // Use the tag to decide which data to pull
  @Input()
  type: 'favorites' | 'latest' | 'results' | 'shopping-list' = 'favorites';
  // recipes signal is set in constructor

  toggleForm() {
    this.shareService.toggleShareForm();
  }

  emailMessage() {
    this.shareService
      .shareRecipe({
        recipient_email: this.shareService.emailAddress(),
        recipe_id: this.recipes()[0]?.id, // Adjust as needed for your use case
        message: this.shareService.messageBody(),
      })
      .subscribe({
        next: () => {
          this.shareService.resetShareForm();
          this.dialogRef.close();
        },
        error: (err) => {
          // show an error message
          this.shareService.showSnackbar('Failed to send email');
        },
      });
  }
}
