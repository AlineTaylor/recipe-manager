import { Component, inject } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { RecipeCardComponent } from '../shared/layout/recipe-card/recipe-card.component';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  readonly dialog = inject(MatDialog);
  emailSharingComponent = EmailSharingComponent;
  openDialog(
    component: ComponentType<any>,
    type: 'favorites' | 'recently-viewed' | 'results'
  ) {
    this.dialog.open(component, {
      data: { type },
    });
  }
}
