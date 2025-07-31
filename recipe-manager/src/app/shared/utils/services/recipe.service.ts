import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from '../../../../environments/environment';
// import { Recipe } from '../recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}

  // getRecipes(): Observable<Recipe[]> {
  //   return this.http.get<Recipe[]>(`${environment.apiUrl}/recipes`);
  // }

  // getRecipe(id: number): Observable<{ recipe: Recipe }> {
  //   return this.http.get<{ recipe: Recipe }>(
  //     `${environment.apiUrl}/recipes/${id}`
  //   );
  // }

  // createRecipe(recipe: Recipe): Observable<Recipe> {
  //   return this.http.post<Recipe>(`${environment.apiUrl}/recipes`, { recipe });
  // }

  // updateRecipe(id: number, recipe: Recipe): Observable<Recipe> {
  //   return this.http.put<Recipe>(`${environment.apiUrl}/recipes/${id}`, {
  //     recipe,
  //   });
  // }

  // deleteRecipe(id: number): Observable<void> {
  //   return this.http.delete<void>(`${environment.apiUrl}/recipes/${id}`);
  // }
}
