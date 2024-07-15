import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../common/material.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../../models/employee';
import { IndexedDbService } from '../../services/indexed-db.service';
import { MY_FORMATS } from '../../common/date-format';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ],
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditEmployeeComponent implements OnInit, AfterViewInit{

  employeeForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  dbService = inject(IndexedDbService);
  id!: number;
  matDialogData = inject(MAT_DIALOG_DATA);
  private readonly destroy: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {

    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: [''], 
    })
  }

  ngAfterViewInit(): void {
    let actionType = this.matDialogData.actionType;
    if(actionType === 'Edit') {
      this.id = this.matDialogData.employee.id;
      this.employeeForm.patchValue({
        name: this.matDialogData.employee.name,
        role: this.matDialogData.employee.role,
        start_date: moment(this.matDialogData.employee.start_date),
        end_date: this.matDialogData.employee.end_date !== '' ? moment(this.matDialogData.employee.end_date) : '',
      })
    }
  }

  onSubmit() {
    let employee = this.employeeForm.value;
    employee.start_date = moment(this.employeeForm.value.start_date).format('DD MMM, YYYY');
    employee.end_date =  moment(this.employeeForm.value.end_date).format('DD MMM, YYYY') !== 'Invalid date' ? moment(this.employeeForm.value.end_date).format('DD MMM, YYYY') : '' ;
    if(this.employeeForm.valid) {
      if(this.matDialogData.actionType === 'Add') {
        this.addEmployee(employee)
      } else {
        employee.id = this.id;
        this.updateEmployee(employee);
      }
    }
  }
  
  addEmployee(employee: Employee) {
    this.dbService.addEmployee(employee)
      .pipe(
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: Error) => {
        console.error(error);
      }
    });
  }

  updateEmployee(employee: Employee) {
    this.dbService.updateEmployee(employee)
      .pipe(
        takeUntilDestroyed(this.destroy)
      )
      .subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: Error) => {
        console.error(error);
      }
    });
  }
}



