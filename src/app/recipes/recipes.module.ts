import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DropdownDirective } from '../shared/dropdown.directive';
import { SharedModule } from '../shared/shared.module';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { SelectRecipeComponent } from './select-recipe/select-recipe.component';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeItemComponent,
    SelectRecipeComponent,
    RecipeEditComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    RecipesRoutingModule,
  ],
  exports: [DropdownDirective],
})
export class RecipesModule {}
