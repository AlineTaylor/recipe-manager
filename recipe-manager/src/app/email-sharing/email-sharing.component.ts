import { Component, computed, inject, Input } from '@angular/core';
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

  constructor() {
    const dialogData = inject(MAT_DIALOG_DATA, { optional: true });
    if (dialogData && dialogData.type) {
      this.type = dialogData.type;
    }
  }

  // Use the tag to decide which data to pull
  // TODO - remember to update types
  @Input()
  type: 'favorites' | 'recently-viewed' | 'results' = 'favorites';

  // dynamically choose the data based on the type
  // TODO get this hooked up once ready
  recipes = computed(() => {
    // const result =
    //   this.type === 'results'
    //     ? this.recipeService.filteredResults()
    //     : this.type === 'favorites'
    //     ? this.recipeService.favoriteItems()
    //     : this.recipeService.recentlyViewedItems();
    // return result;
  });

  toggleForm() {
    this.shareService.toggleShareForm();
  }

  emailMessage() {
    // this.shareService.logSharedItems(this.recipes());
    this.shareService.resetShareForm();
    this.dialogRef.close();
  }
}
