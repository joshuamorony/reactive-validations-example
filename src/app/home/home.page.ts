import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { passwordMatchesValidator } from './utils/password-matches';

@Component({
  selector: 'app-create-form',
  template: `
    <form [formGroup]="createForm" (ngSubmit)="onSubmit()" #form="ngForm">
      <ion-item>
        <ion-label>email</ion-label>
        <ion-input
          formControlName="email"
          data-test="create-email-field"
          type="email"
        ></ion-input>
      </ion-item>
      <!-- Displaying standard validation errors -->
      <ion-badge
        *ngIf="
          (createForm.controls.email.statusChanges | async) === 'INVALID' ||
          (form.submitted && !createForm.controls.email.valid)
        "
      >
        Please provide a valid email
      </ion-badge>
      <ion-item>
        <ion-label>password</ion-label>
        <ion-input
          formControlName="password"
          data-test="create-password-field"
          type="password"
        ></ion-input>
      </ion-item>
      <ion-badge
        *ngIf="
          (createForm.controls.password.statusChanges | async) === 'INVALID' ||
          (form.submitted && !createForm.controls.password.valid)
        "
      >
        Password must be at least 8 characters long
      </ion-badge>
      <ion-item>
        <ion-label>confirm password</ion-label>
        <ion-input
          formControlName="confirmPassword"
          data-test="create-confirm-field"
          type="password"
        ></ion-input>
      </ion-item>
      <!-- Display form group level validation error -->
      <ion-badge
        *ngIf="
          ((createForm.controls.confirmPassword.statusChanges | async) ||
            form.submitted) &&
          passwordMatches(createForm.controls.confirmPassword) !== null
        "
      >
        Must match password field
      </ion-badge>

      <ion-button expand="full" data-test="create-button" type="submit">
        Create Account
      </ion-button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  // Set up as a class member so it is accessible on template
  passwordMatches = passwordMatchesValidator;

  createForm = this.fb.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: [''],
    },
    {
      updateOn: 'blur',
      validators: [this.passwordMatches],
    }
  );

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.createForm.valid) {
      const { confirmPassword, ...credentials } = this.createForm.value;
      console.log(credentials);
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage,
      },
    ]),
  ],
  declarations: [HomePage],
  exports: [RouterModule],
})
export class HomePageModule {}
