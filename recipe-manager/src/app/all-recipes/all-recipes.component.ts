import { Component, inject, Input, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Recipe } from '../shared/utils/recipe.model';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { RecipeCardComponent } from '../shared/layout/recipe-card/recipe-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RecipeExpandComponent } from '../shared/layout/recipe-expand/recipe-expand.component';

@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.css',
})
export class AllRecipesComponent {
  @Input({ required: true }) recipes: Recipe[] = [];
  paginatedRecipes: Recipe[] = [];
  private recipeService = inject(RecipeService);
  readonly dialog = inject(MatDialog);
  //displaying cards
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getRecipes().subscribe((data) => {
      this.recipes = data;
      this.setPaginatedData();
    });
  }

  onPageChange(event: PageEvent) {
    this.setPaginatedData(event.pageIndex, event.pageSize);
  }

  setPaginatedData(pageIndex: number = 0, pageSize: number = 5) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.paginatedRecipes = this.recipes.slice(start, end);
  }

  //expanded recipe view

  expandRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(RecipeExpandComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: recipe,
      panelClass: 'recipe-expand',
    });

    //refresh recipe list when a recipe is deleted from exp view
    dialogRef.afterClosed().subscribe((wasDeleted) => {
      if (wasDeleted) {
        this.loadRecipes();
      }
    });
  }

  //result filtering

  // results = this.searchService.filteredResults;

  // updateSearch(type: string) {
  //   this.searchService.setType(type);
  // }

  // filterByType(event: Event) {
  //   const value = (event.target as HTMLSelectElement).value;
  //   this.searchService.setType(value);
  // }

  //emailing sharing

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
