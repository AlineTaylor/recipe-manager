import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientList, Recipe } from '../shared/utils/recipe.model';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { UnitToggleComponent } from '../shared/layout/unit-toggle/unit-toggle.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [
    SharedModule,
    UnitToggleComponent,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css',
})
export class AddEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  recipeForm!: FormGroup;
  isEdit = signal(false);
  unitSystem: WritableSignal<'metric' | 'imperial'> = signal('metric');

  recipeId: number | null = null;

  ngOnInit() {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      servings: [1, Validators.required],
      cooking_time: [0, Validators.required],
      favorite: [false],
      shopping_list: [false],
      label: this.fb.group({
        vegetarian: [false],
        vegan: [false],
        gluten_free: [false],
        dairy_free: [false],
      }),
      ingredient_lists: this.fb.array([]),
      instructions: this.fb.array([]),
    });

    this.recipeId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.recipeId) {
      this.isEdit.set(true);
      this.recipeService.getRecipe(this.recipeId).subscribe((res) => {
        this.populateForm(res.recipe);
      });
    } else {
      this.addIngredient(); // start with one ingredient
      this.addInstruction(); // start with one instruction
    }
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredient_lists') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(data: any = null) {
    this.ingredients.push(
      this.fb.group({
        metric_qty: [data?.metric_qty || null, Validators.required],
        metric_unit: [data?.metric_unit || '', Validators.required],
        imperial_qty: [data?.imperial_qty || null],
        imperial_unit: [data?.imperial_unit || ''],
        ingredient: this.fb.group({
          ingredient: [data?.ingredient?.ingredient || '', Validators.required],
        }),
      })
    );
  }

  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
  }

  addInstruction(data: any = null) {
    this.instructions.push(
      this.fb.group({
        step_number: [data?.step_number || this.instructions.length + 1],
        step_content: [data?.step_content || '', Validators.required],
      })
    );
  }

  removeInstruction(i: number) {
    this.instructions.removeAt(i);
  }

  populateForm(recipe: Recipe) {
    this.recipeForm.patchValue({
      title: recipe.title,
      servings: recipe.servings,
      cooking_time: recipe.cooking_time,
      favorite: recipe.favorite,
      shopping_list: recipe.shopping_list,
      label: recipe.label,
    });
    recipe.ingredient_lists.forEach((ing) => this.addIngredient(ing));
    recipe.instructions.forEach((inst) => this.addInstruction(inst));
  }

  saveRecipe() {
    if (this.recipeForm.invalid) return;

    const raw = this.recipeForm.value;

    // clean up payload for smooth backend communication

    const payload = {
      title: raw.title,
      servings: raw.servings,
      cooking_time: raw.cooking_time,
      favorite: raw.favorite,
      shopping_list: raw.shopping_list,
      instructions_attributes: raw.instructions,
      ingredient_lists_attributes: raw.ingredient_lists.map(
        (i: IngredientList) => {
          const {
            metric_qty,
            metric_unit,
            imperial_qty,
            imperial_unit,
            ingredient,
          } = i;

          return {
            metric_qty,
            metric_unit,
            imperial_qty,
            imperial_unit,
            ingredient_attributes: ingredient, // this is the key rename
          };
        }
      ),
      label_attributes: raw.label,
    };

    const req = this.isEdit()
      ? this.recipeService.updateRecipe(this.recipeId!, { recipe: payload })
      : this.recipeService.createRecipe({ recipe: payload });

    req.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit() ? 'Recipe updated!' : 'Recipe created!',
          'Close',
          { duration: 3000, verticalPosition: 'top' }
        );
        this.router.navigate(['/my-recipes']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(
          'Something went wrong, please try again',
          'Dismiss',
          {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          }
        );
      },
    });

    if (this.isEdit()) {
      this.recipeService
        .updateRecipe(this.recipeId!, { recipe: payload })
        .subscribe(() => {
          this.router.navigate(['/my-recipes']);
        });
    } else {
      this.recipeService.createRecipe({ recipe: payload }).subscribe(() => {
        this.router.navigate(['/my-recipes']);
      });
    }
  }
}
