import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.module';
import { ShoppingListService } from '../shooping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css'],
})
export class ShoppingListEditComponent implements OnInit {
  @ViewChild('myForm') shoppingListForm: NgForm;
  startedEditingSubs: Subscription;
  editItemIndex: number;
  editMode = false;
  editedItem: Ingredient;
  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}
  ngOnInit(): void {
    this.startedEditingSubs = this.shoppingListService.startedEditing.subscribe(
      (editItemIndex: number) => {
        this.editMode = true;
        this.editItemIndex = editItemIndex;
        this.editedItem = this.shoppingListService.getIngredient(
          this.editItemIndex
        );
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  onAddClicked(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      if (this.checkNameComparison()) {
        this.shoppingListService.updateIngredient(
          this.editItemIndex,
          newIngredient
        );
      } else {
        alert('Wrong Name!!!');
      }
    } else {
      // this.shoppingListService.addIngredient(newIngredient);99
      this.store.dispatch(
        new ShoppingListActions.AddIngredientAction(newIngredient)
      );
    }
    this.editMode = false;
    form.reset();
  }
  onClear() {
    // console.log(res);
    this.shoppingListForm.reset();
    this.editMode = false;
  }
  onDelete() {
    console.log(this.editedItem.name);
    console.log(this.shoppingListForm.value.name);
    this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }
  isDeleteEnabled() {
    if (this.editMode) {
      if (this.checkNameComparison()) {
        return true;
      }
    }
    return false;
  }

  private checkNameComparison(): boolean {
    const res = (this.shoppingListForm.value.name as string).localeCompare(
      this.editedItem.name
    );
    if (res === 0) {
      return true;
    }
    return false;
  }
}
