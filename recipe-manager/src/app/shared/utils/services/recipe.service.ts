import { HttpClient } from '@angular/common/http';
import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  Signal,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Recipe } from '../recipe.model';
import { persistentSignal } from '../../persistent-signal';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private userService = inject(UserService);
  //favorites signals
  private _favoritesChanged = signal(0); // increment to trigger effects
  readonly favoritesChanged = this._favoritesChanged.asReadonly();

  //shopping list signals
  private _shoppingListChanged = signal(0);
  readonly shoppingListChanged = this._shoppingListChanged.asReadonly();

  //persistent signal for latest
  private _latestSignal: WritableSignal<Recipe[]> | null = null;

  constructor(
    private http: HttpClient,
    private injector: EnvironmentInjector
  ) {}

  get latestRecipes(): Signal<Recipe[]> {
    if (!this._latestSignal) {
      const user = this.userService.getUserSignal()();
      const userId = user?.id ?? 'anonymous';

      const signalRef = runInInjectionContext(this.injector, () =>
        persistentSignal<Recipe[]>(`recentlyViewed-${userId}`, [])
      );

      this._latestSignal = signalRef; // now has .set() and .update()
    }

    // Return a computed signal that transforms dates from localStorage
    return computed(() => {
      const current = this._latestSignal!();
      return current.map((recipe) => this.transformDates(recipe));
    });
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(`${environment.apiUrl}/recipes`)
      .pipe(
        map((recipes) => recipes.map((recipe) => this.transformDates(recipe)))
      );
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http
      .get<Recipe>(`${environment.apiUrl}/recipes/${id}`)
      .pipe(map((recipe) => this.transformDates(recipe)));
  }

  createRecipe(payload: { recipe: Partial<Recipe> }): Observable<Recipe> {
    return this.http
      .post<Recipe>(`${environment.apiUrl}/recipes`, payload)
      .pipe(
        map((recipe) => this.transformDates(recipe)),
        tap((recipe) => this.addToLatest(recipe))
      );
  }

  updateRecipe(
    id: number,
    payload: { recipe: Partial<Recipe> }
  ): Observable<Recipe> {
    return this.http
      .put<Recipe>(`${environment.apiUrl}/recipes/${id}`, payload)
      .pipe(map((recipe) => this.transformDates(recipe)));
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/recipes/${id}`);
  }

  //shopping list logic
  getShoppingListRecipes(): Observable<Recipe[]> {
    // TODO: Ideally this should be server-side filtering: /recipes?shopping_list=true
    // For now, we'll cache the result to avoid repeated full fetches
    return this.http
      .get<Recipe[]>(`${environment.apiUrl}/recipes?shopping_list=true`)
      .pipe(
        map((recipes) => recipes.map((recipe) => this.transformDates(recipe))),
        map((recipes) => recipes.filter((r) => r.shopping_list))
      );
  }

  toggleShoppingList(recipe: Recipe): void {
    const updated = { ...recipe, shopping_list: !recipe.shopping_list };
    this.updateRecipe(recipe.id, {
      recipe: { shopping_list: updated.shopping_list },
    }).subscribe({
      next: () => {
        recipe.shopping_list = updated.shopping_list;
        this._shoppingListChanged.update((count) => count + 1); // trigger signal
      },
      error: (err) => {
        console.error('Failed to toggle shopping list:', err);
        // Revert the optimistic update if it fails
        // (In a real app, you might want to show a snackbar error)
      },
    });
  }

  isShoppingListed(recipe: Recipe): boolean {
    return recipe.shopping_list === true;
  }

  //favoriting logic
  getFavoriteRecipes(): Observable<Recipe[]> {
    // TODO: Ideally this should be server-side filtering: /recipes?favorite=true
    // For now, we'll add query param (may not work until backend supports it)
    return this.http
      .get<Recipe[]>(`${environment.apiUrl}/recipes?favorite=true`)
      .pipe(
        map((recipes) => recipes.map((recipe) => this.transformDates(recipe))),
        map((recipes) => recipes.filter((r) => r.favorite))
      );
  }

  toggleFavorite(recipe: Recipe): void {
    const updated = { ...recipe, favorite: !recipe.favorite };
    this.updateRecipe(recipe.id, {
      recipe: { favorite: updated.favorite },
    }).subscribe({
      next: () => {
        recipe.favorite = updated.favorite;
        this._favoritesChanged.update((count) => count + 1); // trigger the signal
      },
      error: (err) => {
        console.error('Failed to toggle favorite:', err);
      },
    });
  }

  isFavorited(recipe: Recipe): boolean {
    return recipe.favorite === true;
  }

  private getLatestSignalWritable(): WritableSignal<Recipe[]> {
    // Ensure the signal is initialized
    this.latestRecipes;
    return this._latestSignal!;
  }

  // latest recipes logic

  addToLatest(recipe: Recipe) {
    const latestSignal = this.getLatestSignalWritable();
    const current = latestSignal();
    // Transform dates in case they were serialized/deserialized from localStorage
    const transformedCurrent = current.map((r) => this.transformDates(r));
    const filtered = transformedCurrent.filter((r) => r.id !== recipe.id);
    latestSignal.set([recipe, ...filtered].slice(0, 10));
  }

  removeFromLatest(recipeId: number) {
    const latestSignal = this.getLatestSignalWritable();
    const current = latestSignal();
    const filtered = current.filter((r) => r.id !== recipeId);
    latestSignal.set(filtered);
  }

  private transformDates(recipe: any): Recipe {
    return {
      ...recipe,
      created_at: recipe.created_at ? new Date(recipe.created_at) : undefined,
      updated_at: recipe.updated_at ? new Date(recipe.updated_at) : undefined,
    };
  }
}
