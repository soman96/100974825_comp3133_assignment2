import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const http = httpLink.create({ uri: environment.graphqlUri });

      // add authorization header to each request if token exists in localStorage
      const auth = new ApolloLink((operation, forward) => {
        const token = localStorage.getItem('token');
        // operation.setContext merges into the existing context safely
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
          },
        }));
        return forward(operation);
      });

      return {
        link: ApolloLink.from([auth, http]),
        cache: new InMemoryCache(),
      };
    }),
  ],
};