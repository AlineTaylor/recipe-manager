import { Component, inject, Input, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from '../shared/utils/services/share.service';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-email-sharing-component',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './email-sharing.component.html',
  styleUrls: ['./email-sharing.component.css'],
})
export class EmailSharingComponent {
  private recipeService = inject(RecipeService);
  public shareService = inject(ShareService);
  public dialogRef = inject(MatDialogRef<EmailSharingComponent>);
  // Removed MAT_DIALOG_DATA from constructor for consistency
  private dialogData = inject(MAT_DIALOG_DATA, { optional: true }) as any;

  recipes = signal<any[]>([]);
  constructor() {
    if (this.dialogData && this.dialogData.type) {
      this.type = this.dialogData.type;
    }

    // Handle recipes or shopping list based on type
    if (this.type === 'favorites') {
      this.recipeService.getFavoriteRecipes().subscribe((recipes) => {
        this.recipes.update(() => recipes);
      });
    } else if (this.type === 'latest') {
      // copy latestRecipes signal value into writable signal; if latestRecipes is a signal, call it
      const latest =
        typeof this.recipeService.latestRecipes === 'function'
          ? this.recipeService.latestRecipes()
          : this.recipeService.latestRecipes;
      this.recipes.update(() => latest || []);
    } else if (
      this.type === 'results' &&
      this.dialogData &&
      this.dialogData.recipes
    ) {
      // results passed in as dialog data
      this.recipes.update(() => this.dialogData.recipes);
    } else if (
      this.type === 'shopping-list' &&
      this.dialogData &&
      this.dialogData.shoppingList
    ) {
      // shopping list passed in as dialog data
      this.recipes.update(() => this.dialogData.shoppingList);
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
    this.shareService.shareRecipe({
      recipient_email: this.shareService.emailAddress(),
      recipe_id: this.recipes()[0]?.id, // Adjust as needed for your use case
      message: this.shareService.messageBody(),
    });
    const payloadBase = {
      recipient_email: this.shareService.emailAddress(),
      sender_email: this.shareService.emailAddress(),
      sender_name: this.shareService.senderName(),
    } as any;

    if (this.type === 'shopping-list') {
      // send shopping list payload
      const ingredients = this.recipes();
      this.shareService
        .shareShoppingList({
          ...payloadBase,
          ingredients,
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
      return;
    }

    // default: recipe sharing
    const recipeId = this.recipes()[0]?.id;
    if (!recipeId) {
      this.shareService.showSnackbar('No recipe available to share');
      return;
    }

    this.shareService
      .shareRecipe({
        ...payloadBase,
        recipe_id: recipeId,
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
