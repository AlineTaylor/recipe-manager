export interface IngredientLists {
  id: number;
  ingredient_id: number;
  recipe_id: number;
  metric_qty: number;
  metric_unit: string;
  imperial_qty: number;
  imperial_unit: string;
}

export interface Instructions {
  id: number;
  recipe_id: number;
  step_number: number;
  step_content: string;
}

export interface Labels {
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  dairy_free: boolean;
}

export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  // description: string;
  // imageUrl: string;
  servings: number;
  cooking_time: number; // in min
  favorite: boolean;
  shopping_list: boolean;
  ingredients: IngredientLists[];
  instructions: Instructions[];
  labels: Labels[];
  createdAt: Date;
  updatedAt: Date;
}
