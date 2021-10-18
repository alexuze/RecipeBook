import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipesService: RecipeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes: Recipe[] = this.recipesService.getRecipes();
    console.log(recipes);
    if (recipes.length === 0) {
      console.log(1);
      return this.dataStorageService.fetchRecipes();
    } else {
      console.log(2);
      return recipes;
    }
  }
}
