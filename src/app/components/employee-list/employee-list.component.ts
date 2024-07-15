import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditEmployeeComponent } from "../add-edit-employee/add-edit-employee.component";
import { MaterialModule } from '../../common/material.module';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from '../../models/employee';
import { IndexedDbService } from '../../services/indexed-db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    AddEditEmployeeComponent,
],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit{

  employees: Employee[] = [];
  readonly dialog = inject(MatDialog);
  dbService = inject(IndexedDbService);
  private _snackBar = inject(MatSnackBar);
  private readonly destroy: DestroyRef = inject(DestroyRef);
  employeeSignal = signal<Employee[]>([]);
  currentEmployeeCount!: number;
  previousEmployeeCount!: number;
  ngOnInit(): void {
    this.loadEmployees();
  }

  // for add & edit
  openDialog(actionType: string, employee?: Employee) {
    const dialogRef = this.dialog.open(AddEditEmployeeComponent, {
      data: {
        actionType,
        employee
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.loadEmployees();
    });
  }

  loadEmployees(): void {
    this.dbService.getAllEmployees()
      .pipe(
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
      next: (response: any) => {
        console.log(response);
        this.employeeSignal.set(response);
        this.currentEmployeeCount = response.filter((emp: Employee) => emp.end_date == '').length;
        this.previousEmployeeCount = response.filter((emp: Employee) => emp.end_date !== '').length;
      },
      error: (error: Error) => {
        console.error(error);
      }
    });
  }

  deleteEmployee(employee: Employee) {
    this.dbService.deleteEmployee(employee.id)
      .pipe(
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
      next: (response: any) => {
        console.log(response);
        let snackBarRef = this._snackBar.open('Employee data has been deleted', 'Undo',  {"duration": 2000});
        snackBarRef.onAction().subscribe(() => {
          console.log('Undo action...');
          this.undoAction(employee);
        })
        this.loadEmployees();
      },
      error: (error: Error) => {
        console.error(error);
      }
    })
  }

  undoAction(employee: Employee) {
    this.dbService.addEmployee(employee).subscribe({
      next: (response: any) => {
        this.loadEmployees();
      },
      error: (error: Error) => {
        console.log(error);
      }
    });
  }
}
