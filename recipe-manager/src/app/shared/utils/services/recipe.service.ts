import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Recipe } from '../recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.apiUrl}/recipes`);
  }

  getRecipe(id: number): Observable<{ recipe: Recipe }> {
    return this.http.get<{ recipe: Recipe }>(
      `${environment.apiUrl}/recipes/${id}`
    );
  }

  createRecipe(payload: { recipe: Partial<Recipe> }): Observable<Recipe> {
    return this.http.post<Recipe>(`${environment.apiUrl}/recipes`, payload);
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

  getShoppingListRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(`${environment.apiUrl}/recipes`)
      .pipe(map((recipes) => recipes.filter((r) => r.shopping_list)));
  }

  //favoriting logic
  getFavoriteRecipes(): Observable<Recipe[]> {
    return this.getRecipes().pipe(
      map((recipes) => recipes.filter((r) => r.favorite))
    );
  }

  toggleFavorite(recipe: Recipe): void {
    const updated = { ...recipe, favorite: !recipe.favorite };
    this.updateRecipe(recipe.id, {
      recipe: { favorite: updated.favorite },
    }).subscribe({
      next: () => {
        recipe.favorite = updated.favorite; // Update locally so UI responds instantly
      },
      error: (err) => {
        console.error('Failed to toggle favorite:', err);
      },
    });
  }

  isFavorited(recipe: Recipe): boolean {
    return recipe.favorite === true;
  }
}
