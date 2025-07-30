import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { InfoComponent } from './info/info.component';
import { AllRecipesComponent } from './all-recipes/all-recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'welcome', component: LandingComponent },
  // might want to think about how to combine login and landing
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-recipes', component: AllRecipesComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'info', component: InfoComponent },

  // lazy loading
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
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
