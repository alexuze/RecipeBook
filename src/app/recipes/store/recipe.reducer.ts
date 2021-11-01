import { Ingredient } from 'src/app/shared/ingredient.module';
import { Recipe } from '../recipe.model';
import * as RecipesActions from '../store/recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipeReducer(
  state = initialState,
  action: RecipesActions.AllActions
) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };
    case RecipesActions.ADD_RECIPE:
      return addRecipe(state, action.payload);
    case RecipesActions.UPDATE_RECIPE:
      return updateRecipe(state, action.payload);
    case RecipesActions.DELETE_RECIPE:
      return deleteRecipe(state, action.payload);
    default:
      return state;
  }
}

const addRecipe: (
  state: State,
  payload: {
    name: string;
    description: string;
    imgPath: string;
    ingredients: Ingredient[];
  }
) => State = (state, payload) => {
  const recipe: Recipe = new Recipe(
    payload.name,
    payload.description,
    payload.imgPath,
    payload.ingredients
  );
  const newRecipes = [...state.recipes, recipe];
  return {
    ...state,
    recipes: newRecipes,
  };
};

const deleteRecipe: (state: State, payload: number) => State = (
  state,
  payload
) => {
  console.log(payload);
  return {
    ...state,
    recipes: state.recipes.filter((recipe, index) => {
      return index !== payload;
    }),
  };
};

const updateRecipe: (
  state: State,
  payload: {
    id: number;
    name: string;
    description: string;
    imgPath: string;
    ingredients: Ingredient[];
  }
) => State = (state, payload) => {
  const newRecipe = new Recipe(
    payload.name,
    payload.description,
    payload.imgPath,
    payload.ingredients
  );
  const updatedRecipes = [...state.recipes];
  updatedRecipes[payload.id] = newRecipe;
  console.log(updatedRecipes);
  return {
    ...state,
    recipes: updatedRecipes,
  };
};
