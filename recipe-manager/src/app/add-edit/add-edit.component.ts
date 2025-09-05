import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
  effect,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientList, Recipe } from '../shared/utils/recipe.model';
import { Ingredient } from '../shared/utils/recipe.model';
import { IngredientService } from '../shared/utils/services/ingredient.service';
import { RecipeService } from '../shared/utils/services/recipe.service';
import { UnitToggleComponent } from '../shared/layout/unit-toggle/unit-toggle.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { convertUnits } from '../shared/utils/convert-units';
import { environment } from '../../environments/environment';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [
    SharedModule,
    UnitToggleComponent,
    MatCheckboxModule,
    MatSnackBarModule,
    MatAutocompleteModule,
  ],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css',
})
export class AddEditComponent implements OnInit {
  // handler for ingredient selection from autocomplete
  onIngredientSelected(event: any, index: number) {
    const selectedName = event.option.value;
    const selected = this.globalIngredients().find(
      (ing) => ing.ingredient === selectedName
    );
    if (selected) {
      const ingredientGroup = this.ingredients.at(index).get('ingredient');
      ingredientGroup?.get('id')?.setValue(selected.id);
      ingredientGroup?.get('ingredient')?.setValue(selected.ingredient);
    }
  }
  private ingredientService = inject(IngredientService);
  globalIngredients = signal<Ingredient[]>([]);
  recipePictureUrl: string | null = null;

  getRecipePictureUrl(): string | null {
    return this.recipePictureUrl;
  }

  onRecipeFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    // check if file was selected and if it is in edit mode by checking whether recipeId already exists
    if (input.files && input.files[0] && this.recipeId) {
      const file = input.files[0];
      this.isLoading.set(true);
      // compress image before uploading
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      imageCompression(file, options)
        .then((compressedFile) => {
          // create form data obj and append file under 'picture' key for backend via http
          const formData = new FormData();
          formData.append('picture', compressedFile);
          // send patch request via service
          this.recipeService
            .uploadRecipePicture(this.recipeId!, formData)
            .subscribe({
              next: () => {
                this.snackBar.open('Recipe picture updated!', 'Close', {
                  duration: 3000,
                  panelClass: ['snackbar-success'],
                });
                this.recipeService.getRecipe(this.recipeId!).subscribe({
                  next: (recipe) => {
                    this.recipePictureUrl = recipe.picture_url
                      ? `${environment.apiUrl}${recipe.picture_url}`
                      : null;
                    this.isLoading.set(false);
                  },
                  error: () => {
                    this.isLoading.set(false);
                  },
                });
              },
              error: (err) => {
                console.error('Recipe picture upload failed', err);
                this.snackBar.open(
                  'Failed to upload recipe picture.',
                  'Close',
                  {
                    duration: 5000,
                    panelClass: ['snackbar-error'],
                  }
                );
                this.isLoading.set(false);
              },
            });
        })
        .catch((err) => {
          console.error('Image compression failed', err);
          this.snackBar.open('Image compression failed.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
          this.isLoading.set(false);
        });
    }
  }
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private injector = inject(EnvironmentInjector);

  recipeForm!: FormGroup;
  isEdit = signal(false);
  isLoading = signal(false);
  unitSystem: WritableSignal<'metric' | 'imperial'> = signal('metric');

  recipeId: number | null = null;

  ngOnInit() {
    // load global ingredients for mat-autocomplete
    this.ingredientService.getAllIngredients().subscribe((ingredients) => {
      this.globalIngredients.set(ingredients);
    });
    this.initializeForm();
    this.setupRouteHandling();
    this.setupUnitConversion();
  }

  private initializeForm() {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      servings: [1, [Validators.required, Validators.min(1)]],
      cooking_time: [0, [Validators.required, Validators.min(0)]],
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
  }

  private setupRouteHandling() {
    this.recipeId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.recipeId) {
      this.isEdit.set(true);
      this.isLoading.set(true);
      this.recipeService.getRecipe(this.recipeId).subscribe({
        next: (recipe) => {
          this.populateForm(recipe);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error retrieving recipe:', err);
          this.isLoading.set(false);
          this.snackBar.open(
            'Unable to load recipe. Please try again.',
            'Close',
            {
              duration: 3000,
              panelClass: ['snackbar-error'],
            }
          );
          this.router.navigate(['/my-recipes']);
        },
      });
    } else {
      this.addIngredient(); // start with one ingredient
      this.addInstruction(); // start with one instruction
    }
  }

  private setupUnitConversion() {
    // auto-trigger when unit conversion toggle changes
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const system = this.unitSystem();
        this.convertAllUnits(system);
      });
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredient_lists') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(data: Partial<IngredientList> | null = null) {
    this.ingredients.push(
      this.fb.group({
        id: [data?.id || null], // include the ID of the ingredient if editing so that the correct ingredient is referenced when editing
        metric_qty: [data?.metric_qty || null, Validators.required],
        metric_unit: [data?.metric_unit || '', Validators.required],
        imperial_qty: [data?.imperial_qty || null],
        imperial_unit: [data?.imperial_unit || ''],
        ingredient: this.fb.group({
          id: [data?.ingredient?.id || null],
          ingredient: [data?.ingredient?.ingredient || '', Validators.required],
        }),
      })
    );
  }

  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
  }

  addInstruction(
    data: Partial<{
      id: number;
      step_number: number;
      step_content: string;
    }> | null = null
  ) {
    this.instructions.push(
      this.fb.group({
        id: [data?.id || null], // include the ID of the instruction if editing so that the correct instruction is referenced when editing
        step_number: [data?.step_number || this.instructions.length + 1],
        step_content: [data?.step_content || '', Validators.required],
      })
    );
  }

  removeInstruction(i: number) {
    this.instructions.removeAt(i);
  }

  private populateForm(recipe: Recipe) {
    if (!recipe) {
      console.warn('populateForm received undefined!');
      return;
    }
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description || '',
      servings: recipe.servings,
      cooking_time: recipe.cooking_time,
      favorite: recipe.favorite,
      shopping_list: recipe.shopping_list,
      label: recipe.label,
    });
    recipe.ingredient_lists.forEach((ing) => this.addIngredient(ing));
    recipe.instructions.forEach((inst) => this.addInstruction(inst));
    this.recipePictureUrl = recipe.picture_url
      ? `${environment.apiUrl}${recipe.picture_url}`
      : null;
  }

  saveRecipe() {
    if (this.recipeForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.recipeForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 4000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    const raw = this.recipeForm.value;

    // clean up payload for smooth backend communication
    const payload = {
      title: raw.title,
      description: raw.description,
      servings: raw.servings,
      cooking_time: raw.cooking_time,
      favorite: raw.favorite,
      shopping_list: raw.shopping_list,
      instructions_attributes: raw.instructions.map(
        (instruction: any, index: number) => ({
          id: instruction.id || null,
          step_number: index + 1,
          step_content: instruction.step_content,
        })
      ),

      //Including IDs for all nested attributes (create new ones if non-existing) to ensure proper association and correct updates
      ingredient_lists_attributes: raw.ingredient_lists.map(
        (i: IngredientList) => {
          const {
            id,
            metric_qty,
            metric_unit,
            imperial_qty,
            imperial_unit,
            ingredient,
          } = i;

          const base = {
            id,
            metric_qty,
            metric_unit,
            imperial_qty,
            imperial_unit,
          };

          return ingredient?.id
            ? { ...base, ingredient_id: ingredient.id }
            : { ...base, ingredient_attributes: ingredient };
        }
      ),
      label_attributes: raw.label,
    };

    const req = this.isEdit()
      ? this.recipeService.updateRecipe(this.recipeId!, { recipe: payload })
      : this.recipeService.createRecipe({ recipe: payload });

    this.isLoading.set(true);
    req.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open(
          this.isEdit() ? 'Recipe updated!' : 'Recipe created!',
          'Close',
          { duration: 3000, verticalPosition: 'top' }
        );
        this.router.navigate(['/my-recipes']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
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
  }

  //unit conversion
  convertAllUnits(system: 'metric' | 'imperial') {
    this.ingredients.controls.forEach((ctrl) => {
      const group = ctrl as FormGroup;

      const fromQty = group.get(
        system === 'metric' ? 'imperial_qty' : 'metric_qty'
      )?.value;
      const fromUnit = group.get(
        system === 'metric' ? 'imperial_unit' : 'metric_unit'
      )?.value;
      const toUnit = group.get(
        system === 'metric' ? 'metric_unit' : 'imperial_unit'
      )?.value;

      // Only convert if we have valid source data and both units are conversion-compatible
      if (
        fromQty != null &&
        fromQty > 0 &&
        fromUnit &&
        toUnit &&
        fromUnit !== 'count' &&
        toUnit !== 'count'
      ) {
        const converted = convertUnits(fromQty, fromUnit, toUnit);
        if (converted != null && converted > 0) {
          const targetControlName =
            system === 'metric' ? 'metric_qty' : 'imperial_qty';
          group.get(targetControlName)?.setValue(converted);
        }
      }
    });
  }

  getUnits(system: 'metric' | 'imperial'): string[] {
    const common = ['count'];
    const metricUnits = ['g', 'kg', 'ml', 'l'];
    const imperialUnits = ['oz', 'lb', 'fl oz', 'cups', 'tsp', 'tbsp'];

    return system === 'metric'
      ? [...metricUnits, ...common]
      : [...imperialUnits, ...common];
  }

  // Helper method to get field validation errors
  getFieldError(fieldName: string): string {
    const field = this.recipeForm.get(fieldName);
    if (field?.hasError('required'))
      return `${this.getFieldDisplayName(fieldName)} is required`;
    if (field?.hasError('min'))
      return `${this.getFieldDisplayName(fieldName)} must be greater than 0`;
    if (field?.hasError('max'))
      return `${this.getFieldDisplayName(fieldName)} exceeds maximum value`;
    return '';
  }

  // Helper method to check if field has errors and is touched
  hasFieldError(fieldName: string): boolean {
    const field = this.recipeForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  // Helper method to get user-friendly field names
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: Record<string, string> = {
      title: 'Recipe title',
      servings: 'Number of servings',
      cooking_time: 'Cooking time',
    };
    return fieldNames[fieldName] || fieldName;
  }

  // Helper method to check if form is ready to submit
  isFormValid(): boolean {
    return (
      this.recipeForm.valid &&
      this.ingredients.length > 0 &&
      this.instructions.length > 0
    );
  }
}
