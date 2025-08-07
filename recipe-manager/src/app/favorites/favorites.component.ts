import { Component, inject, Input, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { RecipeCardComponent } from '../shared/layout/recipe-card/recipe-card.component';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Recipe } from '../shared/utils/recipe.model';
import { RecipeService } from '../shared/utils/services/recipe.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  readonly dialog = inject(MatDialog);
  private recipeService = inject(RecipeService);
  emailSharingComponent = EmailSharingComponent;
  @Input({ required: true }) recipes: Recipe[] = [];
  paginatedRecipes: Recipe[] = [];

  //displaying cards
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getFavoriteRecipes().subscribe((data) => {
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

  //email sharing
  openDialog(
    component: ComponentType<any>,
    type: 'favorites' | 'recently-viewed' | 'results'
  ) {
    this.dialog.open(component, {
      data: { type },
    });
  }
}
