export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  // description: string;
  // imageUrl: string;
  servings: number;
  cookingTime: number; // in min
  isFavorite: boolean;
  inShoppingList: boolean;
  // TODO figure out how to set up nested attributes in this model
  ingredients: string[];
  instructions: string[];
  labels: boolean[];
  createdAt: Date;
  updatedAt: Date;
}
