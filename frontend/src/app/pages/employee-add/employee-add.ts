import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';

import { ADD_EMPLOYEE } from '../../core/graphql/queries';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './employee-add.html',
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;
  loading = false;
  error = '';
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    // Validators match your backend validateEmployeeInput() rules exactly:
    // salary >= 1000, gender must be Male/Female/Other
    this.employeeForm = this.fb.group({
      first_name:      ['', Validators.required],
      last_name:       ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      gender:          ['Male', Validators.required],
      designation:     ['', Validators.required],
      department:      ['', Validators.required],
      salary:          ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      employee_photo:  [''],
    });
  }

  get f() { return this.employeeForm.controls; }

  // Convert the selected image to a base64 data URL and store it in the form.
  // We pass this string to the GraphQL mutation as employee_photo.
  // Your backend resolver then calls cloudinary.uploader.upload(base64) itself —
  // we never touch Cloudinary directly from Angular.
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string; // "data:image/jpeg;base64,/9j/..."
      this.photoPreview = base64;                // Show local preview immediately
      this.employeeForm.patchValue({ employee_photo: base64 });
    };
    reader.readAsDataURL(input.files[0]);
  }

  onSubmit(): void {
    this.employeeForm.markAllAsTouched();
    if (this.employeeForm.invalid) return;

    this.loading = true;
    this.error = '';

    const v = this.employeeForm.value;

    this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: {
        // addEmployee(input: EmployeeInput!) — wrap everything in "input"
        input: {
          first_name:      v.first_name,
          last_name:       v.last_name,
          email:           v.email,
          gender:          v.gender,
          designation:     v.designation,
          department:      v.department,
          salary:          parseFloat(v.salary), // Must be Float not string
          date_of_joining: v.date_of_joining,
          employee_photo:  v.employee_photo || null,
        },
      },
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.graphQLErrors?.[0]?.message ?? 'Failed to add employee.';
      },
    });
  }
}