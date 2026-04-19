import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import {
  GET_ALL_EMPLOYEES,
  SEARCH_EMPLOYEES,
  DELETE_EMPLOYEE,
} from '../../core/graphql/queries';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './employee-list.html',
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  loading = true;
  error = '';

  searchDept  = '';
  searchDesig = '';
  selectedEmployee: any = null;

  // ChangeDetectorRef lets us manually tell Angular to re-check the template.
  // In Angular 17 standalone, Apollo's observable runs outside Angular's zone,
  // so setting loading = false doesn't always trigger a re-render automatically.
  constructor(
    private apollo: Apollo,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.apollo.query({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'network-only',
    }).subscribe({
      next: ({ data }: any) => {
        this.employees = data.getAllEmployees;
        this.loading = false;
        this.cdr.detectChanges(); // Force Angular to update the template
      },
      error: (err) => {
        this.error = err.graphQLErrors?.[0]?.message ?? err.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    const dept  = this.searchDept.trim();
    const desig = this.searchDesig.trim();

    if (!dept && !desig) {
      this.loadAll();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.apollo.query({
      query: SEARCH_EMPLOYEES,
      fetchPolicy: 'network-only',
      variables: {
        department:  dept  || undefined,
        designation: desig || undefined,
      },
    }).subscribe({
      next: ({ data }: any) => {
        this.employees = data.searchEmployees;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.graphQLErrors?.[0]?.message ?? err.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  clearSearch(): void {
    this.searchDept  = '';
    this.searchDesig = '';
    this.loadAll();
  }

  viewEmployee(emp: any): void {
    this.selectedEmployee = emp;
    this.cdr.detectChanges();
    const el = document.getElementById('detailModal');
    if (el) new (window as any).bootstrap.Modal(el).show();
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string, name: string): void {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { eid: id },
    }).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e._id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.graphQLErrors?.[0]?.message ?? 'Delete failed.';
        this.cdr.detectChanges();
      },
    });
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return d.substring(0, 10);
  }

  avatarUrl(emp: any): string {
    return emp.employee_photo ||
      `https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=5865f2&color=fff&size=64`;
  }
}