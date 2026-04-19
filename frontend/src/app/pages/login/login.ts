import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';

import { LOGIN } from '../../core/graphql/queries';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private auth: AuthService,
    private router: Router
  ) {
    // If already logged in skip the login page entirely
    if (this.auth.isLoggedIn()) this.router.navigate(['/employees']);

    // Initialize the form with empty fields and validators
    this.loginForm = this.fb.group({
      username_or_email: ['', [Validators.required, Validators.minLength(3)]],
      password:          ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Convenience getter for easy access to form fields in the template
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation messages
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.apollo.query({
      query: LOGIN,
      variables: {
        
        input: {
          username_or_email: this.f['username_or_email'].value,
          password:          this.f['password'].value,
        },
      },
    }).subscribe({
      next: ({ data }: any) => {
        this.loading = false;
        this.auth.setToken(data.login.token); // Store JWT in localStorage
        this.router.navigate(['/employees']); // Go to protected route
      },
      error: (err) => {
        this.loading = false;

        // Extract a user friendly error message from the GraphQL error response
        this.error = err.graphQLErrors?.[0]?.message ?? 'Login failed. Please try again.';
      },
    });
  }
}