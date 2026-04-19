import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,  
    NavbarComponent,
  ],
  template: `
    <!-- Navbar sits outside router-outlet so it persists across all route changes -->
    <app-navbar />

    <!-- Angular swaps this placeholder for the current route's component -->
    <router-outlet />
  `,
})
export class AppComponent {}