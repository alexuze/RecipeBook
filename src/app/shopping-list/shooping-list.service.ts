import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.module';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatoes', 10),
  ];
  public startedEditing = new Subject<number>();
  public ingredientChanged = new Subject<Ingredient[]>();

  addIngredients(ingredients: Ingredient[]) {
    let currIngIndex;
    for (let i = 0; i < ingredients.length; i++) {
      currIngIndex = this.getIngredientIndex(ingredients[i]);
      if (currIngIndex) {
        this.ingredients[currIngIndex].amount += ingredients[i].amount;
      } else {
        this.ingredients.push(ingredients[i]);
      }
    }
    this.notifyIngredientsChanged();
  }

  addIngredient(ingredient: Ingredient) {
    let ingredientIndex = this.getIngredientIndex(ingredient);
    if (ingredientIndex != null) {
      let currAmount: number = +this.ingredients[ingredientIndex].amount;
      let addedAmount: number = +ingredient.amount;
      currAmount = currAmount + addedAmount;
      this.ingredients[ingredientIndex].amount = currAmount;
    } else {
      this.ingredients.push(ingredient);
    }
    this.notifyIngredientsChanged();
  }
  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredientIndex(ingredient: Ingredient) {
    for (let i = 0; i < this.ingredients.length; i++) {
      let res = this.ingredients[i].name.localeCompare(ingredient.name);
      if (res === 0) return i;
    }
    return null;
  }

  notifyIngredientsChanged() {
    this.ingredientChanged.next(this.getIngredients());
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    console.log(newIngredient);
    const newIngredientIndex = this.getIngredientIndex(newIngredient);
    if (newIngredientIndex != null) {
      console.log('in update');
      console.log(newIngredientIndex);
      this.ingredients[newIngredientIndex].amount = +newIngredient.amount;
      //this.ingredients.splice(index, 1);
    } else {
      this.ingredients[index] = newIngredient;
    }
    this.notifyIngredientsChanged();
  }
  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.notifyIngredientsChanged();
  }
}
