import { HttpClient } from '@angular/common/http';
import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  Signal,
  signal,
  WritableSignal,
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

    return this._latestSignal; // no .asReadonly() needed
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.apiUrl}/recipes`);
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${environment.apiUrl}/recipes/${id}`);
  }

  createRecipe(payload: { recipe: Partial<Recipe> }): Observable<Recipe> {
    return this.http
      .post<Recipe>(`${environment.apiUrl}/recipes`, payload)
      .pipe(tap((recipe) => this.addToLatest(recipe)));
  }

  updateRecipe(
    id: number,
    payload: { recipe: Partial<Recipe> }
  ): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${environment.apiUrl}/recipes/${id}`,
      payload
    );
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/recipes/${id}`);
  }

  //shopping list logic
  getShoppingListRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(`${environment.apiUrl}/recipes`)
      .pipe(map((recipes) => recipes.filter((r) => r.shopping_list)));
  }

  toggleShoppingList(recipe: Recipe): void {
    const updated = { ...recipe, ShoppingList: !recipe.shopping_list };
    this.updateRecipe(recipe.id, {
      recipe: { shopping_list: updated.ShoppingList },
    }).subscribe({
      next: () => {
        recipe.shopping_list = updated.ShoppingList;
        this._shoppingListChanged.update((count) => count + 1); // trigger signal
      },
      error: (err) => {
        console.error('Failed to toggle ShoppingList:', err);
      },
    });
  }

  isShoppingListed(recipe: Recipe): boolean {
    return recipe.shopping_list === true;
  }

  //favoriting logic
  getFavoriteRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(`${environment.apiUrl}/recipes`)
      .pipe(map((recipes) => recipes.filter((r) => r.favorite)));
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

  // latest recipes logic

  addToLatest(recipe: Recipe) {
    const current = this._latestSignal!(); // non-null assertion
    const filtered = current.filter((r) => r.id !== recipe.id);
    this._latestSignal!.set([recipe, ...filtered].slice(0, 10));
  }
}
