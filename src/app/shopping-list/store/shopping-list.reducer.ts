import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.module';
import * as ShoppingListActions from './shopping-list.actions';

type stateType = { ingredients: Ingredient[] };
const initialState = {
  ingredients: [new Ingredient('Apple', 5), new Ingredient('Tomatoes', 10)],
};

export function shoppingListReducer(
  state: stateType = initialState,
  action: ShoppingListActions.AllActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return addIngredient(state, action.payload);
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    default:
      return state;
  }
}

const getIngredientIndex = (
  newIngredient: Ingredient,
  ingredients: Ingredient[]
) => {
  for (let i = 0; i < ingredients.length; i++) {
    let res = ingredients[i].name.localeCompare(newIngredient.name);
    if (res === 0) return i;
  }
  return null;
};

const addIngredient = (state: stateType, newIngredient: Ingredient) => {
  let ingredientIndex = getIngredientIndex(newIngredient, state.ingredients);
  if (ingredientIndex != null) {
    let newIngredients: Ingredient[] = [...state.ingredients];
    console.log(newIngredients);
    let currAmount: number = +state.ingredients[ingredientIndex].amount;
    let addedAmount: number = +newIngredient.amount;
    currAmount = currAmount + addedAmount;

    const tempIng: Ingredient = { ...newIngredients[ingredientIndex] };

    tempIng.amount = currAmount;
    newIngredients[ingredientIndex] = tempIng;
    return {
      ...state,
      ingredients: newIngredients,
    };
  } else {
    return {
      ...state,
      ingredients: [...state.ingredients, newIngredient],
    };
  }
};
