import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.module';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredientsObs: Observable<{ ingredients: Ingredient[] }>;
  // ingredientsChangedSub: Subscription;
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.ingredientsObs = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientsChangedSub =
    //   this.shoppingListService.ingredientChanged.subscribe(
    //     (ingredients: Ingredient[]) => {
    //       this.ingredients = ingredients;
    //     }
    //   );
  }
  ngOnDestroy() {
    // this.ingredientsChangedSub.unsubscribe();
  }

  onEditIngredient(index: number) {
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEditAction(index));
  }
}
