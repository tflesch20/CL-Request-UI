import { Component, Input, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material';
import {ErrorModalComponent} from '../modal/error-modal.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {
  @Input() actives;
  @Input() all;
  @Input() text;

  constructor(public dialog: MatDialog) {}

  resetTag(tagIndex: number) {
      this.actives[tagIndex].deleted = false;
  }

  resetTag2(tagIndex: number, valueIndex: number, tag2Index: number) {
    this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].deleted = false;
  }

  reset(tagIndex: number, valueIndex: number) {
    if (!this.actives[tagIndex].values[valueIndex].deleted) {
      document.getElementById('id:' + tagIndex + ':' + valueIndex).innerText = this.actives[tagIndex].values[valueIndex].value;
      this.actives[tagIndex].values[valueIndex].newValue = this.actives[tagIndex].values[valueIndex].value;
      this.actives[tagIndex].values[valueIndex].edited = false;
    } else {
      this.actives[tagIndex].values[valueIndex].date = new Date();
    }
    this.actives[tagIndex].values[valueIndex].deleted = false;
  }

  reset2(tagIndex: number, valueIndex: number, tag2Index: number, value2Index: number) {
    if (!this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].deleted) {
      document.getElementById('id:' + tagIndex + ':' + valueIndex + ':' + tag2Index + ':' + value2Index).innerText
      = this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].value;
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].newValue = null;
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].edited = false;
    } else {
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].date = new Date();
    }
    this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].deleted = false;
  }

  addDelete(tagIndex: number, valueIndex: number) {
    if (valueIndex === -1) {
      this.actives[tagIndex].deleted = true;
      this.actives[tagIndex].date = new Date();
    } else {
      this.actives[tagIndex].values[valueIndex].deleted = true;
      this.actives[tagIndex].values[valueIndex].date = new Date();
    }
  }

  addDelete2(tagIndex: number, valueIndex: number, tag2Index: number, value2Index: number) {
    if (value2Index === -1) {
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].deleted = true;
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].date = new Date();
    } else {
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].deleted = true;
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].date = new Date();
    }
  }

  handleUpdate(newValue: string, tagIndex: number, valueIndex: number) {
    if (this.actives[tagIndex].values[valueIndex].value !== newValue) {
      const tempValue = newValue.trim().toLowerCase();
      for (let i = 0; i < this.actives[tagIndex].values.length; i++) {
        const tempValue2 = this.actives[tagIndex].values[i].value.trim().toLowerCase();
        if (tempValue.localeCompare(tempValue2) === 0 && i !== valueIndex) {
          const dialogRef = this.dialog.open(ErrorModalComponent, {
            panelClass: ['dialog'],
            data: {
              tag: this.actives[tagIndex].tag,
              newValue: this.actives[tagIndex].values[i].value,
              edited: false
            },
            position: {top: '30%'},
            disableClose: false
          });
          dialogRef.afterClosed().subscribe(result => {
            document.getElementById('id:' + tagIndex + ':' + valueIndex).innerText = this.actives[tagIndex].values[valueIndex].value;
            this.actives[tagIndex].values[valueIndex].edited = false;
          });
          return;
        }
        if (tempValue.localeCompare(this.actives[tagIndex].values[i].newValue.trim().toLowerCase()) === 0 &&
        i !== valueIndex) {
          const dialogRef = this.dialog.open(ErrorModalComponent, {
            panelClass: ['dialog'],
            data: {
              tag: this.actives[tagIndex].tag,
              newValue: this.actives[tagIndex].values[i].newValue,
              edited: true
            },
            position: {top: '30%'},
            disableClose: false
          });
          dialogRef.afterClosed().subscribe(result => {
            document.getElementById('id:' + tagIndex + ':' + valueIndex).innerText = this.actives[tagIndex].values[valueIndex].value;
            this.actives[tagIndex].values[valueIndex].edited = false;
          });
          return;
        }
      }
      this.actives[tagIndex].values[valueIndex].edited = true;
      this.actives[tagIndex].values[valueIndex].newValue = newValue;
      this.actives[tagIndex].values[valueIndex].date = new Date();
    } else {
      this.actives[tagIndex].values[valueIndex].edited = false;
    }
    console.log(this.actives[tagIndex]);
  }

  handleUpdate2(newValue: string, tagIndex: number, valueIndex: number, tag2Index: number, value2Index: number) {

    if (this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].value !== newValue) {
      const tempValue = newValue.trim().toLowerCase();
      for (let i = 0; i < this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2.length; i++) {
        const tempValue2 =
        this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[i].value.trim().toLowerCase();
        if (tempValue.localeCompare(tempValue2) === 0 && i !== valueIndex) {
          const dialogRef = this.dialog.open(ErrorModalComponent, {
            panelClass: ['dialog'],
            data: {
              tag: this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].tag,
              newValue: this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[i].value
            },
            position: {top: '30%'},
            disableClose: false
          });
          dialogRef.afterClosed().subscribe(result => {
            document.getElementById('id:' + tagIndex + ':' + valueIndex + ':' + tag2Index + ':' + value2Index).innerText =
            this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[i].value;
          });
          return;
        }
      }
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].edited = true;
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].newValue = newValue;
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].date = new Date();
    } else {
      this.actives[tagIndex].values[valueIndex].tagsLevel2[tag2Index].valuesLevel2[value2Index].edited = false;
    }
  }
}
