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
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthResponseData } from '../shared/interfaces/authResponseData.interface';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Subscription } from 'rxjs';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private cmpFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onLogin(email: string, password: string) {
    this.authService.login(email, password).subscribe(
      (responseData) => {
        console.log('login subscribe');
        this.isLoginMode = false;
        this.router.navigate(['/']);
      },
      (errorMessage) => {
        this.isLoading = false;
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        console.log(this.error);
      }
    );
  }

  private onSignUp(email: string, password: string) {
    this.authService.signup(email, password).subscribe(
      (responseData) => {
        this.isLoginMode = true;
        this.isLoading = false;
        this.error = null;
        console.log(responseData);
      },
      (errorMessage) => {
        this.isLoading = false;
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        console.log(this.error);
      }
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
    this.error = null;
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
  }
}
