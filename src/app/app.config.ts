import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const dbConfig: DBConfig = {
  name: 'EmployeeDB',
  version: 1,
  objectStoresMeta: [{
    store: 'employees',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'role', keypath: 'role', options: { unique: false } },
      { name: 'start_date', keypath: 'start_date', options: { unique: false } },
      { name: 'end_date', keypath: 'end_date', options: { unique: false } }
    ]
  }]
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    importProvidersFrom(
      NgxIndexedDBModule.forRoot(dbConfig)
    ), provideAnimationsAsync()
  ]
};
