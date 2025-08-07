import {
  Component,
  computed,
  effect,
  inject,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
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

  recipes = signal<Recipe[]>([]);
  pageIndex = signal(0);
  pageSize = signal(5);

  paginatedRecipes = computed(() => {
    const recipes = this.recipes();
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return recipes.slice(start, end);
  });

  //displaying cards
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadRecipes();
    effect(() => {
      this.recipeService.favoritesChanged(); // watch signal
      this.loadRecipes();
    });
  }

  loadRecipes() {
    this.recipeService.getFavoriteRecipes().subscribe((data) => {
      this.recipes.set(data); // trigger computed() to run
    });
  }

  handleFavoriteToggled(recipe: Recipe) {
    // Remove the unfavorited recipe immediately from the signal
    const updated = this.recipes().filter((r) => r.id !== recipe.id);
    this.recipes.set(updated);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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
