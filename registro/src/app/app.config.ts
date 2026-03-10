import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environments';
import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    //registra il services Keycloak
    //così da poterlo iniettare dove ci serve
    { provide: Keycloak, useValue: keycloak },
    provideAppInitializer(async () => {
      await keycloak.init({
        onLoad: 'check-sso', //controlla se l'utente è loggato
        checkLoginIframe: false,
      });
    }),
  ]
};
