import { Component, inject, Input, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Recipe, Label } from '../shared/utils/recipe.model';
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
  labelFilters: (keyof Label)[] = [];
  labelOptions: { key: keyof Label; label: string; icon: string }[] = [
    { key: 'vegetarian', label: 'Vegetarian', icon: '🥕' },
    { key: 'vegan', label: 'Vegan', icon: '🌱' },
    { key: 'gluten_free', label: 'Gluten Free', icon: '🚫🌾' },
    { key: 'dairy_free', label: 'Dairy Free', icon: '🥛❌' },
  ];
  sortOption: string = 'az';
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

  //sorting logic
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
      case 'shortest':
        this.recipes.sort(
          (a, b) => (a.cooking_time ?? 0) - (b.cooking_time ?? 0)
        );
        break;
      case 'longest':
        this.recipes.sort(
          (a, b) => (b.cooking_time ?? 0) - (a.cooking_time ?? 0)
        );
        break;
      default:
        break;
    }
  }

  //filtering logic
  get filteredRecipes(): Recipe[] {
    if (!this.labelFilters.length) return this.recipes;
    return this.recipes.filter((recipe) => {
      if (!recipe.label) return false;
      return this.labelFilters.every(
        (filter) => recipe.label && recipe.label[filter as keyof Label] === true
      );
    });
  }

  toggleLabelFilter(label: keyof Label) {
    if (this.labelFilters.includes(label)) {
      this.labelFilters = this.labelFilters.filter((l) => l !== label);
    } else {
      this.labelFilters = [...this.labelFilters, label];
    }
    this.setPaginatedData(
      this.paginator?.pageIndex || 0,
      this.paginator?.pageSize || 5
    );
  }

  //pagination logic
  onPageChange(event: PageEvent) {
    this.setPaginatedData(event.pageIndex, event.pageSize);
  }

  setPaginatedData(pageIndex: number = 0, pageSize: number = 5) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.paginatedRecipes = this.filteredRecipes.slice(start, end);
  }

  //email sharing
  emailSharingComponent = EmailSharingComponent;
  openDialog(
    component: ComponentType<any>,
    type: 'favorites' | 'latest' | 'results'
  ) {
    // For 'results', pass filteredRecipes as dialog data
    const data: any = { type };
    if (type === 'results') {
      data.recipes = this.filteredRecipes;
    }
    this.dialog.open(component, { data });
  }

  //print functionality
  printPage() {
    window.print();
  }
}
