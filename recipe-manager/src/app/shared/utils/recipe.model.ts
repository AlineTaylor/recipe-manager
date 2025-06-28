export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // in min
  cookTime: number; // in min
  servings: number;
  category: string; // TODO create presets for selection later
  isFavorite: boolean; //TODO create a toggle button for favoriting
  createdAt?: Date; // optional
  updatedAt?: Date; // optional
}
