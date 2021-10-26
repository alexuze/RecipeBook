import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as authActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private cmpFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.error = authState.authError;
      this.isLoading = authState.isLoading;
      if (this.error) {
        this.showErrorAlert(this.error);
      } else if (!this.isLoginMode) {
        this.showErrorAlert('Signed Up Successfully , Clear this to Login');
      }
      this.isLoginMode = authState.isLoginMode;
    });
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onLogin(email: string, password: string) {
    this.store.dispatch(
      new authActions.LoginStartAction({ email: email, password: password })
    );
  }

  private onSignUp(email: string, password: string) {
    this.store.dispatch(
      new authActions.SignupStartAction({ email: email, password: password })
    );
  }

  checkInputValidity(inputName: string) {
    const input: AbstractControl = this.authForm.get(inputName);
    return !input.valid && input.touched;
  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.authForm.value);
    if (!this.authForm.valid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    if (this.isLoginMode === false) {
      this.onSignUp(email, password);
    } else {
      this.onLogin(email, password);
    }
    this.authForm.reset();
  }

  onErrorAck() {
    this.store.dispatch(new authActions.ClearErrorAction());
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory =
      this.cmpFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const alertCmpRef = hostViewContainerRef.createComponent(alertCmpFactory);

    alertCmpRef.instance.message = message;
    this.closeSub = alertCmpRef.instance.errorAck.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
