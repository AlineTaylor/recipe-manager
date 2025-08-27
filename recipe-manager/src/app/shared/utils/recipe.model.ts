export interface Ingredient {
  id: number;
  ingredient: string;
}
export interface IngredientList {
  id: number;
  ingredient_id: number;
  metric_qty: number;
  metric_unit: string;
  imperial_qty: number;
  imperial_unit: string;
  ingredient: Ingredient | null;
}

export interface Instruction {
  id: number;
  step_number: number;
  step_content: string;
}

export interface Label {
  id?: number;
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  dairy_free: boolean;
}

export interface Recipe {
  id: number;
  title: string;
  // description: string;
  servings: number;
  cooking_time: number; // in min
  favorite: boolean;
  shopping_list: boolean;
  ingredient_lists: IngredientList[];
  instructions: Instruction[];
  label: Label | null;
  created_at?: Date;
  updated_at?: Date;
  picture_url?: string;
}
