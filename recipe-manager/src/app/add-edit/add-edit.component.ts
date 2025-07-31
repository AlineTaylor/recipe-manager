import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { RecipeService } from '../shared/utils/services/recipe.service';
// import { Recipe } from '../shared/utils/recipe.model';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css',
})
// implements OnInit
export class AddEditComponent {
  // recipeForm!: FormGroup;

  constructor() {} // private fb: FormBuilder, private recipeService: RecipeService

  // ngOnInit(): void {
  //   this.recipeForm = this.fb.group({
  //     title: ['', Validators.required],
  //     servings: [0, Validators.min(1)],
  //     cooking_time: [0, Validators.min(0)],
  //     favorite: [false],
  //     shopping_list: [false],
  //     ingredients: this.fb.array([]),
  //     instructions: this.fb.array([]),
  //     labels: this.fb.group({
  //       vegetarian: [false],
  //       gluten_free: [false],
  //       quick: [false],
  //       family_friendly: [false],
  //     }),
  //   });

  //   // TODO set up loadRecipe(id) here later
  // }

  // get ingredients(): FormArray {
  //   return this.recipeForm.get('ingredients') as FormArray;
  // }

  // get instructions(): FormArray {
  //   return this.recipeForm.get('instructions') as FormArray;
  // }

  // addIngredient() {
  //   this.ingredients.push(
  //     this.fb.group({
  //       name: ['', Validators.required],
  //       quantity: [0, Validators.min(0)],
  //       unit: [''],
  //     })
  //   );
  // }

  // addInstruction() {
  //   this.instructions.push(
  //     this.fb.group({
  //       step_number: [this.instructions.length + 1],
  //       content: ['', Validators.required],
  //     })
  //   );
  // }

  // removeIngredient(index: number) {
  //   this.ingredients.removeAt(index);
  // }

  // removeInstruction(index: number) {
  //   this.instructions.removeAt(index);
  // }

  // save() {
  //   if (this.recipeForm.invalid) return;

  //   const recipe: Recipe = this.recipeForm.value;
  //   this.recipeService.createRecipe(recipe).subscribe();
  // }

  // loadRecipe(id: number) {
  //   this.recipeService.getRecipe(id).subscribe((res) => {
  //     this.recipeForm.patchValue(res.recipe);

  //     // put nested attributes back together
  //     this.ingredients.clear();
  //     res.recipe.ingredients.forEach((i) =>
  //       this.ingredients.push(this.fb.group(i))
  //     );

  //     this.instructions.clear();
  //     res.recipe.instructions.forEach((ins) =>
  //       this.instructions.push(this.fb.group(ins))
  //     );
  //   });
  // }
}
