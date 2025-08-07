import { Component, inject, Input, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';
import { RecipeCardComponent } from '../shared/layout/recipe-card/recipe-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { Recipe } from '../shared/utils/recipe.model';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.css',
})
export class LatestComponent {
  readonly dialog = inject(MatDialog);
  private recipeService = inject(RecipeService);

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
