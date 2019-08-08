import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ListData} from '../ListData';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListData) {}

  }
}
