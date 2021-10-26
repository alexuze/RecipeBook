import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.module';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState = {
  ingredients: [new Ingredient('Apple', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.AllActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return addIngredient(state, action.payload);
    case ShoppingListActions.ADD_INGREDIENTS:
      return addIngredients(state, action.payload);
    case ShoppingListActions.UPDATE_INGREDIENT:
      return updateIngredient(state, action.payload);
    case ShoppingListActions.DELETE_INGREDIENT:
      return deleteIngredient(state);
    case ShoppingListActions.START_EDIT:
      return startEdit(state, action.payload);
    case ShoppingListActions.STOP_EDIT:
      return stopEdit(state);
    default:
      return state;
  }
}

const stopEdit: (state: State) => State = (state) => {
  return {
    ...state,
    editedIngredient: null,
    editedIngredientIndex: -1,
  };
};

const startEdit: (state: State, payload: number) => State = (
  state,
  payload
) => {
  return {
    ...state,
    editedIngredient: state.ingredients[payload],
    editedIngredientIndex: payload,
  };
};

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

const getUpdatedIngredient: (
  amountToAdd: number,
  oldIng: Ingredient
) => Ingredient = (amountToAdd, oldIng) => {
  console.log('ingredient : ' + oldIng.name);

  console.log('oldIng amount : ' + oldIng.amount);
  console.log('toAdd : ' + amountToAdd);
  let currAmount: number = +oldIng.amount;
  currAmount = currAmount + amountToAdd;

  const tempIng: Ingredient = { ...oldIng };

  tempIng.amount = currAmount;
  console.log('new amount : ' + tempIng.amount);
  return tempIng;
};

const addIngredient: (state: State, newIngredient: Ingredient) => State = (
  state: State,
  newIngredient: Ingredient
) => {
  let ingredientIndex = getIngredientIndex(newIngredient, state.ingredients);
  if (ingredientIndex != null) {
    let newIngredients: Ingredient[] = [...state.ingredients];
    const tempIng = getUpdatedIngredient(
      newIngredient.amount,
      newIngredients[ingredientIndex]
    );
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

const addIngredients: (
  state: State,
  toBeAddedIngredient: Ingredient[]
) => State = (state: State, toBeAddedIngredients: Ingredient[]) => {
  let currentIngIndex: number;
  let nextIngToBeAdded, oldIng: Ingredient;
  const currentIngredients: Ingredient[] = [...state.ingredients];
  for (let i = 0; i < toBeAddedIngredients.length; i++) {
    nextIngToBeAdded = toBeAddedIngredients[i];
    currentIngIndex = getIngredientIndex(nextIngToBeAdded, currentIngredients);
    if (currentIngIndex) {
      oldIng = currentIngredients[currentIngIndex];
      const newIng = getUpdatedIngredient(nextIngToBeAdded.amount, oldIng);
      currentIngredients[currentIngIndex] = newIng;
    } else {
      currentIngredients.push(nextIngToBeAdded);
    }
  }
  return {
    ...state,
    ingredients: currentIngredients,
  };
};

const updateIngredient: (state: State, payload: Ingredient) => State = (
  state,
  payload
) => {
  const oldIng = state.ingredients[state.editedIngredientIndex];
  const updatedIng = {
    ...oldIng, // copy the old ingredient
    ...payload, // overwrite the objects data with the new one
  };
  const newIngredients = [...state.ingredients];
  newIngredients[state.editedIngredientIndex] = updatedIng;
  return {
    ...state,
    ingredients: newIngredients,
    editedIngredient: null,
    editedIngredientIndex: -1,
  };
};

const deleteIngredient: (state: State) => State = (state) => {
  return {
    ...state,
    ingredients: state.ingredients.filter(
      (ing: Ingredient, ingIndex: number) => {
        return ingIndex !== state.editedIngredientIndex;
      }
    ),
    editedIngredient: null,
    editedIngredientIndex: -1,
  };
};
