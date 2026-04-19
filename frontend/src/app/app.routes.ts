import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(c => c.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then(c => c.SignupComponent),
  },
  {
    path: 'employees',
    loadComponent: () => import('./pages/employee-list/employee-list').then(c => c.EmployeeListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'employees/add',
    loadComponent: () => import('./pages/employee-add/employee-add').then(c => c.EmployeeAddComponent),
    canActivate: [authGuard],
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () => import('./pages/employee-edit/employee-edit').then(c => c.EmployeeEditComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/login' }, // Unknown URLs redirect to login
];