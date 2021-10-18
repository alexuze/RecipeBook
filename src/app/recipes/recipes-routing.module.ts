import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeResolverService } from './recipes-resolver.service';
import { RecipesComponent } from './recipes.component';
import { SelectRecipeComponent } from './select-recipe/select-recipe.component';

const recipesRoutes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    // resolve: [RecipeResolverService],
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SelectRecipeComponent,
      },
      {
        path: 'new',
        component: RecipeEditComponent,
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipeResolverService],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipeResolverService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(recipesRoutes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
