import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';

import { GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE } from '../../core/graphql/queries';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './employee-edit.html',
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  loadingData = true;
  saving      = false;
  error = '';
  employeeId = '';
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.employeeForm = this.fb.group({
      first_name:      ['', Validators.required],
      last_name:       ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      gender:          ['Male'],
      designation:     ['', Validators.required],
      department:      ['', Validators.required],
      salary:          ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      employee_photo:  [''],
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.apollo.query({
      query: GET_EMPLOYEE_BY_ID,
      fetchPolicy: 'network-only',
      variables: { eid: this.employeeId },
    }).subscribe({
      next: ({ data }: any) => {
        this.ngZone.run(() => {
          const emp = data.getEmployeeById;
          this.employeeForm.patchValue({
            first_name:      emp.first_name,
            last_name:       emp.last_name,
            email:           emp.email,
            gender:          emp.gender,
            designation:     emp.designation,
            department:      emp.department,
            salary:          emp.salary,
            date_of_joining: emp.date_of_joining?.substring(0, 10),
            employee_photo:  emp.employee_photo ?? '',
          });
          this.photoPreview = emp.employee_photo;
          this.loadingData = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.error = err.graphQLErrors?.[0]?.message ?? err.message;
          this.loadingData = false;
          this.cdr.detectChanges();
        });
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      this.photoPreview = base64;
      this.employeeForm.patchValue({ employee_photo: base64 });
    };
    reader.readAsDataURL(input.files[0]);
  }

  get f() { return this.employeeForm.controls; }

  onSubmit(): void {
    this.employeeForm.markAllAsTouched();
    if (this.employeeForm.invalid) return;

    this.saving = true;
    this.error = '';

    const v = this.employeeForm.value;

    this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: {
        eid: this.employeeId,
        input: {
          first_name:      v.first_name,
          last_name:       v.last_name,
          email:           v.email,
          gender:          v.gender,
          designation:     v.designation,
          department:      v.department,
          salary:          parseFloat(v.salary),
          date_of_joining: v.date_of_joining,
          employee_photo:  v.employee_photo || null,
        },
      },
    }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.saving = false;
          this.router.navigate(['/employees']);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.saving = false;
          this.error = err.graphQLErrors?.[0]?.message ?? 'Update failed.';
          this.cdr.detectChanges();
        });
      },
    });
  }
}