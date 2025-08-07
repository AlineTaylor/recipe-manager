import {
  Component,
  computed,
  inject,
  Input,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
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

  // source signal from service
  latestRecipes = this.recipeService.latestRecipes;

  // pagination controls
  pageIndex = signal(0);
  pageSize = signal(5);

  // derived paginated recipe list
  paginatedRecipes: Signal<Recipe[]> = computed(() => {
    const recipes = this.latestRecipes();
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return recipes.slice(start, end);
  });

  //displaying cards
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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
