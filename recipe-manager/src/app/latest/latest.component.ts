import { Component, inject } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EmailSharingComponent } from '../email-sharing/email-sharing.component';
import { RecipeCardComponent } from '../shared/layout/recipe-card/recipe-card.component';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.css',
})
export class LatestComponent {
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
