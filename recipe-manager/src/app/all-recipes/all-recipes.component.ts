import { Component, inject, Input } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Recipe } from '../shared/utils/recipe.model';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { RecipeCardComponent } from '../shared/layout/recipe-card/recipe-card.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent, MatPaginator],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.css',
})
export class AllRecipesComponent {
  @Input({ required: true }) recipes: Recipe[] = [];
  //result filtering
  private recipeService = inject(RecipeService);
  // results = this.searchService.filteredResults;

  // updateSearch(type: string) {
  //   this.searchService.setType(type);
  // }

  // filterByType(event: Event) {
  //   const value = (event.target as HTMLSelectElement).value;
  //   this.searchService.setType(value);
  // }

  //emailing sharing
  readonly dialog = inject(MatDialog);
  emailSharingComponent = EmailSharingComponent;
  openDialog(
    component: ComponentType<any>,
    type: 'favorites' | 'recently-viewed' | 'results'
  ) {
    this.dialog.open(component, {
      data: { type },
    });
  }
}
