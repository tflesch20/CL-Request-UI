import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ListData } from '../ListData';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html'
})
export class ListModalComponent {
  constructor(public dialogRef: MatDialogRef<ListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListData) {
}
