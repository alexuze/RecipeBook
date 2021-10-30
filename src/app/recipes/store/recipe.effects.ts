import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipesEffects {
  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap((fetchAction: RecipesActions.FetchRecipesAction) => {
        return this.http.get<Recipe[]>(
          'https://recipebook-1ac16-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
        );
      }),
      map((recipes: Recipe[]) => {
        console.log(recipes);
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes: Recipe[]) => {
        return new RecipesActions.SetRecipesAction(recipes);
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
