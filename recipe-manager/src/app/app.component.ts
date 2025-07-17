import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { RecipeCardComponent } from './shared/layout/recipe-card/recipe-card.component';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  imports: [
    SharedModule,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    RecipeCardComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'recipe-manager';
}
