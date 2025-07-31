import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
  { path: 'welcome', component: LandingComponent },

  // lazy loading
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'my-recipes',
    loadComponent: () =>
      import('./all-recipes/all-recipes.component').then(
        (m) => m.AllRecipesComponent
      ),
  },
  {
    path: 'recipe-editor',
    loadComponent: () =>
      import('./add-edit/add-edit.component').then((m) => m.AddEditComponent),
  },
  {
    path: 'shopping-list',
    loadComponent: () =>
      import('./shopping-list/shopping-list.component').then(
        (m) => m.ShoppingListComponent
      ),
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./info/info.component').then((m) => m.InfoComponent),
  },
];
