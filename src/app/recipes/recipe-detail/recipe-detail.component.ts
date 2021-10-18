import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipeId: number;
  recipe: Recipe;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.recipe = this.recipeService.getRecipe(+params['id']);
      this.recipeId = +params['id'];
    });
  }

  toShoppingListClicked() {
    this.recipeService.addIngredientsToShoppingList(this.recipe);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  onDeleteRecipe() {
    console.log(this.recipeId);
    this.recipeService.deleteRecipe(this.recipeId);
    this.router.navigate(['/recipes']);
  }
}
