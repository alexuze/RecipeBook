import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.module';
import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
export const ADD_RECIPE = '[Recipes] Add Recipe';
export const UPDATE_RECIPE = '[Recipes] Update Recipe';
export const DELETE_RECIPE = '[Recipes] Delete Recipe';
export const SAVE_RECIPES = '[Recipes] Save Recipes';
export class SetRecipesAction implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {}
}

export class FetchRecipesAction implements Action {
  readonly type = FETCH_RECIPES;
}

export class AddRecipeAction implements Action {
  readonly type = ADD_RECIPE;
  constructor(
    public payload: {
      name: string;
      description: string;
      imgPath: string;
      ingredients: Ingredient[];
    }
  ) {}
}

export class UpdateRecipeAction implements Action {
  readonly type = UPDATE_RECIPE;
  constructor(
    public payload: {
      id: number;
      name: string;
      description: string;
      imgPath: string;
      ingredients: Ingredient[];
    }
  ) {}
}

export class DeleteRecipeAction implements Action {
  readonly type = DELETE_RECIPE;
  constructor(public payload: number) {}
}

export class SaveRecipesAction implements Action {
  readonly type = SAVE_RECIPES;
}

export type AllActions =
  | SetRecipesAction
  | FetchRecipesAction
  | AddRecipeAction
  | UpdateRecipeAction
  | DeleteRecipeAction
  | SaveRecipesAction;
