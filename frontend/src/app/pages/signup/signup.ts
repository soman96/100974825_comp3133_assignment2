import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';

import { SIGNUP } from '../../core/graphql/queries';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './signup.html',
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    // Initialize the form with validation rules
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.apollo.mutate({
      mutation: SIGNUP,
      variables: {

        // GraphQL variables for the SIGNUP mutation
        input: {
          username: this.f['username'].value,
          email:    this.f['email'].value,
          password: this.f['password'].value,
        },
      },
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created! Redirecting to login...';
        // Pause abit so user can read the success message before redirect
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        // User with that username/email already exists or other server side validation error
        this.error = err.graphQLErrors?.[0]?.message ?? 'Signup failed. Please try again.';
      },
    });
  }
}