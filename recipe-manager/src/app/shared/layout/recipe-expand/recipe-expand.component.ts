import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-recipe-expand',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './recipe-expand.component.html',
  styleUrl: './recipe-expand.component.css',
})
export class RecipeExpandComponent {}
