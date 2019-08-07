import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ErrorData} from '../ErrorData';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html'
})
export class ErrorModalComponent {
  constructor(public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorData) {}
}
