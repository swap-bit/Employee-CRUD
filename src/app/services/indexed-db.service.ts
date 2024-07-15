import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private dbService = inject(NgxIndexedDBService);

  addEmployee(employee: any) {
    return this.dbService.add('employees', employee);
  }

  updateEmployee(employee: any) {
    return this.dbService.update('employees',employee);
  }

  getAllEmployees() {
    return this.dbService.getAll('employees');
  }

  deleteEmployee(id: number) {
    return this.dbService.delete('employees', id);
  }
}
