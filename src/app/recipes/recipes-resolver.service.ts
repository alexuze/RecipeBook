import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new RecipesActions.FetchRecipesAction());
    return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
    // const recipes: Recipe[] = this.recipesService.getRecipes();
    // console.log(recipes);
    // if (recipes.length === 0) {
    //   console.log(1);
    //   return this.dataStorageService.fetchRecipes();
    // } else {
    //   console.log(2);
    //   return recipes;
    // }
  }
}
