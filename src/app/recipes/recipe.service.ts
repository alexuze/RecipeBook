import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';

import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A5 Wagyu',
  //     'This is An A5 Wagyu Steak',
  //     'https://westcoastprimemeats.com/wp-content/uploads/2020/04/12305-3-2-scaled.jpg',
  //     [new Ingredient('Wagyu', 1), new Ingredient('Guga blend', 1)]
  //   ),
  //   new Recipe(
  //     'King Burger',
  //     'The Most Amazing Burger You Will Eat!',
  //     'https://cdn-cmjom.nitrocdn.com/FpMsHpAgoVrRMnuAdmBhGkyiizdsWlSU/assets/static/optimized/rev-0223ca3/wp-content/uploads/2015/07/king-burger-541x633.png',
  //     [
  //       new Ingredient('Buns', 1),
  //       new Ingredient('Tomato', 2),
  //       new Ingredient('Onion', 1),
  //       new Ingredient('Mayonnaise', 2),
  //     ]
  //   ),
  // ];
  private recipes: Recipe[] = [];

  public recipesChanged = new Subject<Recipe[]>();
  constructor(private store: Store<fromApp.AppState>) {}

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.notifyRecipesChange();
  }

  notifyRecipesChange() {
    console.log(this.getRecipes());
    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(recipeId: number) {
    this.recipes.splice(recipeId, 1);
    this.notifyRecipesChange();
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.notifyRecipesChange();
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.notifyRecipesChange();
  }

  generateNewId(): number {
    return this.recipes.length;
  }

  addIngredientsToShoppingList(recipe: Recipe) {
    // this.shoppingListService.addIngredients(recipe.ingredients);
    this.store.dispatch(
      new ShoppingListActions.AddIngredientsAction(recipe.ingredients)
    );
  }

  getRecipe(recipeId: number) {
    return this.recipes[recipeId];
  }
}
