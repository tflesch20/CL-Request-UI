import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html'
})
export class WarningModalComponent {
  constructor(public dialogRef: MatDialogRef<WarningModalComponent>) {}
}
