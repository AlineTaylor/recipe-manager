import { Component, inject, Input, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Recipe } from '../shared/utils/recipe.model';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { RecipeCardComponent } from '../shared/layout/recipe-card/recipe-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-all-recipes',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './all-recipes.component.html',
  styleUrl: './all-recipes.component.css',
})
export class AllRecipesComponent {
  sortOption: string = 'newest';
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
      this.sortRecipes();
      this.setPaginatedData();
    });
  }

  onSortChange(option: string) {
    this.sortOption = option;
    this.sortRecipes();
    this.setPaginatedData(
      this.paginator?.pageIndex || 0,
      this.paginator?.pageSize || 5
    );
  }

  sortRecipes() {
    // switch statement for smooth sorting <3
    switch (this.sortOption) {
      case 'newest':
        this.recipes.sort(
          (a, b) =>
            new Date(b.created_at || '').getTime() -
            new Date(a.created_at || '').getTime()
        );
        break;
      case 'oldest':
        this.recipes.sort(
          (a, b) =>
            new Date(a.created_at || '').getTime() -
            new Date(b.created_at || '').getTime()
        );
        break;
      case 'az':
        this.recipes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        this.recipes.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
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

  //print functionality
  printPage() {
    window.print();
  }
}
