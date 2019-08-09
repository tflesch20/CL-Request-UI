import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogData} from '../DialogData';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  modifiedTags: string[];
  modifiedTags2: string[];
  duplicate = false;
  focus = false;
  level2 = false;
  fixedLevel2 = false;
  constructor(public dialogRef: MatDialogRef<ModalComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.modifiedTags = data.tagTable;
    this.modifiedTags2 = data.tag2Table;
  }

  _tagFilter(value: string) {
    const filterInput = value.toLowerCase();
    this.modifiedTags = this.data.tagTable.filter(option => option.toLowerCase().includes(filterInput));
  }

  _tag2Filter(value: string) {
    const filterInput = value.toLowerCase();
    this.modifiedTags2 = this.data.tag2Table.filter(option => option.toLowerCase().includes(filterInput));
  }

  focused() {
    this.focus = true;
  }

  checkValid() {
      this.focus = false;
      if (this.data.requestTag === '') {
        this.duplicate = false;
        return;
      }
      const tempTag = this.data.requestTag.trim().toLowerCase();
      for (let i = 0; i < this.data.tagValues.length; i++) {
        const otherTag = this.data.tagValues[i].tag.trim().toLowerCase();
        if (tempTag === otherTag) {
          if (this.data.requestValue === '') {
            this.duplicate = false;
            return;
          }
          const tempValue = this.data.requestValue.trim().toLowerCase();
          for (let j = 0; j < this.data.tagValues[i].values.length; j++) {
            const otherValue = this.data.tagValues[i].values[j].value.trim().toLowerCase();
            const newValue = this.data.tagValues[i].values[j].newValue.trim().toLowerCase();
            if (tempValue === otherValue || tempValue === newValue) {
              if (this.data.tagValues[i].values[j].tagsLevel2 && this.data.tagValues[i].values[j].tagsLevel2.length !== 0) {
                this.fixedLevel2 = true;
                this.level2 = true;
                if ( this.data.requestTagLevel2 === '') {
                  this.duplicate = false;
                  return;
                }
                const tempTag2 = this.data.requestTagLevel2.trim().toLowerCase();
                for (let k = 0; k < this.data.tagValues[i].values[j].tagsLevel2.length; k++) {
                  const otherTag2 = this.data.tagValues[i].values[j].tagsLevel2[k].tag.trim().toLowerCase();
                  if (tempTag2 === otherTag2) {
                    if (this.data.requestValueLevel2 === '') {
                      this.duplicate = false;
                      return;
                    }
                    const tempValue2 = this.data.requestValueLevel2.trim().toLowerCase();
                    for (let l = 0; l < this.data.tagValues[i].values[j].tagsLevel2[k].valuesLevel2.length; l++) {
                      const otherValue2 =
                      this.data.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value.trim().toLowerCase();
                      const newValue2 =
                      this.data.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].newValue.trim().toLowerCase();
                      if (tempValue2 === otherValue2 || tempValue2 === newValue2) {
                        this.duplicate = true;
                        return;
                      } else if (tempValue2.localeCompare(otherValue2) < 0) {
                        this.duplicate = false;
                        return;
                      }
                    }
                    this.duplicate = false;
                    return;
                  } else if (tempTag2.localeCompare(otherTag2) < 0) {
                    this.duplicate = false;
                    return;
                  }
                }
                this.duplicate = false;
                return;
              }
              this.fixedLevel2 = false;
              if (this.level2) {
                this.duplicate = false;
              } else {
                this.duplicate = true;
              }
              return;
            } else if (tempValue.localeCompare(otherValue) < 0) {
              this.fixedLevel2 = false;
              this.duplicate = false;
              return;
            }
          }
          this.fixedLevel2 = false;
          this.duplicate = false;
          return;
        } else if (tempTag.localeCompare(otherTag) < 0) {
          this.fixedLevel2 = false;
          this.duplicate = false;
          return;
        }
      }
      this.fixedLevel2 = false;
      this.duplicate = false;
    }
}
