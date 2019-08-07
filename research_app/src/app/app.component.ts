import { Component, HostListener } from '@angular/core';
import { OperationService } from './operation.service';
import {
  CLActive,
  CLChange,
  Tag,
  Value,
  TagLevel2,
  ValueLevel2
} from './models/index';
import { MatDialog } from '@angular/material';
import { ModalComponent } from './modal/modal.component';
import { WarningModalComponent } from './modal/warning-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  actives: CLActive[];
  tags: any[];
  tagsLevel2: any[];
  input = '';
  tagValues: Tag[];
  modifiedTagValues: Tag[];
  allSearch = false;
  previous = '';

  constructor(
    private operationService: OperationService,
    public dialog: MatDialog
  ) {
    this.getCLRequestActives();

    this.operationService.getRequestTags().subscribe(tags => {
      this.tags = tags;
    });

    this.operationService.getRequestTagsLevel2().subscribe(tagsLevel2 => {
      this.tagsLevel2 = tagsLevel2;
    });
  }

  warning() {
    const dialogRef = this.dialog.open(WarningModalComponent, {
      panelClass: ['dialog'],
      position: { top: '20%' }
    });
  }

  getCLRequestActives() {
    this.operationService.getActives().subscribe(acts => {
      this.tagValues = [];
      let previous = '';
      let previousCount = -1;
      let previousVal = '';
      let previousValCount = -1;
      let previous2 = '';
      let previous2Count = -1;
      for (let i = 0; i < acts.length; i++) {
        if (previous !== acts[i].requestTag) {
          // Changing Tag
          let newValue2 = null;
          let newTag2 = null;
          if (
            acts[i].requestTagLevel2 !== null &&
            acts[i].requestValueLevel2 !== null
          ) {
            previous2 = acts[i].requestTagLevel2;
            previous2Count = 0;
            newValue2 = {
              value: acts[i].requestValueLevel2,
              newValue: acts[i].requestValueLevel2,
              edited: false,
              deleted: false,
              added: false,
              date: null
            };
            newTag2 = {
              tag: acts[i].requestTagLevel2,
              deleted: false,
              added: false,
              valuesLevel2: [],
              date: null
            };
            newTag2.valuesLevel2.push(newValue2);
          }
          previousValCount = 0;
          previousVal = acts[i].requestValue;
          previousCount++;
          previous = acts[i].requestTag;
          const newValue: Value = {
            value: acts[i].requestValue,
            newValue: acts[i].requestValue,
            edited: false,
            deleted: false,
            added: false,
            date: null,
            tagsLevel2: []
          };

          if (newTag2 !== null) {
            newValue.tagsLevel2.push(newTag2);
          }

          const newTagValue: Tag = {
            tag: previous,
            values: [],
            deleted: false,
            added: false,
            date: null
          };
          newTagValue.values.push(newValue);
          this.tagValues.push(newTagValue);
        } else {
          if (previousVal !== acts[i].requestValue) {
            // Changing Request Value
            let newValue2 = null;
            let newTag2 = null;
            if (
              acts[i].requestTagLevel2 !== null &&
              acts[i].requestValueLevel2 !== null
            ) {
              previous2 = acts[i].requestTagLevel2;
              previous2Count = 0;
              newValue2 = {
                value: acts[i].requestValueLevel2,
                newValue: acts[i].requestValueLevel2,
                edited: false,
                deleted: false,
                added: false,
                date: null
              };
              newTag2 = {
                tag: acts[i].requestTagLevel2,
                deleted: false,
                added: false,
                valuesLevel2: [],
                date: null
              };
              newTag2.valuesLevel2.push(newValue2);
            }
            previousValCount++;
            previousVal = acts[i].requestValue;
            const newValue: Value = {
              value: acts[i].requestValue,
              newValue: acts[i].requestValue,
              edited: false,
              deleted: false,
              added: false,
              date: null,
              tagsLevel2: []
            };

            if (newTag2 !== null) {
              newValue.tagsLevel2.push(newTag2);
            }

            this.tagValues[previousCount].values.push(newValue);
          } else {
            if (previous2 !== acts[i].requestTagLevel2) {
              // Changing Request Tag Level 2
              previous2 = acts[i].requestTagLevel2;
              previous2Count++;
              const newValue2 = {
                value: acts[i].requestValueLevel2,
                newValue: acts[i].requestValueLevel2,
                edited: false,
                deleted: false,
                added: false,
                date: null
              };
              const newTag2 = {
                tag: acts[i].requestTagLevel2,
                deleted: false,
                added: false,
                valuesLevel2: [],
                date: null
              };
              newTag2.valuesLevel2.push(newValue2);
              this.tagValues[previousCount].values[
                previousValCount
              ].tagsLevel2.push(newTag2);
            } else {
              // Changing Request Value Level 2
              const newValue2 = {
                value: acts[i].requestValueLevel2,
                newValue: acts[i].requestValueLevel2,
                edited: false,
                deleted: false,
                added: false,
                date: null
              };
              this.tagValues[previousCount].values[previousValCount].tagsLevel2[
                previous2Count
              ].valuesLevel2.push(newValue2);
            }
          }
        }
      }
      this.modifiedTagValues = this.tagValues;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: ['add-dialog'],
      data: {
        requestTag: '',
        requestValue: '',
        requestTagLevel2: '',
        requestValueLevel2: '',
        tagTable: this.tags,
        tag2Table: this.tagsLevel2,
        tagValues: this.tagValues
      },
      position: { top: '30%' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === null) {
        return;
      }

      this.addToAutoComplete(result.requestTag, result.requestTagLevel2);

      const tempTag: string = result.requestTag.trim().toLowerCase();
      for (let i = 0; i < this.tagValues.length; i++) {
        const otherTag: string = this.tagValues[i].tag.trim().toLowerCase();
        if (tempTag === otherTag) {
          const tempValue: string = result.requestValue.trim().toLowerCase();
          for (let j = 0; j < this.tagValues[i].values.length; j++) {
            const otherValue: string = this.tagValues[i].values[j].value
              .trim()
              .toLowerCase();
            if (tempValue === otherValue) {
              if (this.tagValues[i].values[j].tagsLevel2) {
                const tempTag2: string = result.requestTagLevel2.trim().toLowerCase();
                for (
                  let k = 0;
                  k < this.tagValues[i].values[j].tagsLevel2.length;
                  k++
                ) {
                  const otherTag2: string = this.tagValues[i].values[j].tagsLevel2[k].tag
                    .trim()
                    .toLowerCase();
                  if (tempTag2 === otherTag2) {
                    const tempValue2: string = result.requestValueLevel2
                      .trim()
                      .toLowerCase();
                    for (
                      let l = 0;
                      l <
                      this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2
                        .length;
                      l++
                    ) {
                      const otherValue2: string = this.tagValues[i].values[j].tagsLevel2[
                        k
                      ].valuesLevel2[l].value;
                      if (tempValue2.localeCompare(otherValue2) < 0) {
                        const val2_1: ValueLevel2 = {
                          value: result.requestValueLevel2,
                          newValue: result.requestValueLevel2,
                          edited: false,
                          deleted: false,
                          added: true,
                          date: new Date()
                        };
                        this.tagValues[i].values[j].tagsLevel2[
                          k
                        ].valuesLevel2.splice(l, 0, val2_1);
                        this.addToModified(i, result.requestTag);
                        return;
                      }
                    }
                    const val2_2: ValueLevel2 = {
                      value: result.requestValueLevel2,
                      newValue: result.requestValueLevel2,
                      edited: false,
                      deleted: false,
                      added: true,
                      date: new Date()
                    };
                    this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2.push(
                      val2_2
                    );
                    this.addToModified(i, result.requestTag);
                    return;
                  } else if (tempTag2.localeCompare(otherTag2) < 0) {
                    const val2_3: ValueLevel2 = {
                      value: result.requestValueLevel2,
                      newValue: result.requestValueLevel2,
                      edited: false,
                      deleted: false,
                      added: true,
                      date: new Date()
                    };
                    const tag2_1: TagLevel2 = {
                      tag: result.requestTagLevel2,
                      deleted: false,
                      added: true,
                      valuesLevel2: [],
                      date: new Date()
                    };
                    tag2_1.valuesLevel2.push(val2_3);
                    this.tagValues[i].values[j].tagsLevel2.splice(k, 0, tag2_1);
                    this.addToModified(i, result.requestTag);
                    return;
                  }
                }
                const val2_4: ValueLevel2 = {
                  value: result.requestValueLevel2,
                  newValue: result.requestValueLevel2,
                  edited: false,
                  deleted: false,
                  added: true,
                  date: new Date()
                };
                const tag2_2: TagLevel2 = {
                  tag: result.requestTagLevel2,
                  deleted: false,
                  added: true,
                  valuesLevel2: [],
                  date: new Date()
                };
                tag2_2.valuesLevel2.push(val2_4);
                this.tagValues[i].values[j].tagsLevel2.push(tag2_2);
                this.addToModified(i, result.requestTag);
                return;
              } else {
                this.tagValues[i].values[j].tagsLevel2 = [];
                const valOther: ValueLevel2 = {
                  value: result.requestValueLevel2,
                  newValue: result.requestValueLevel2,
                  edited: false,
                  deleted: false,
                  added: true,
                  date: new Date()
                };
                const tagOther: TagLevel2 = {
                  tag: result.requestTagLevel2,
                  deleted: false,
                  added: true,
                  valuesLevel2: [],
                  date: new Date()
                };
                tagOther.valuesLevel2.push(valOther);
                this.tagValues[i].values[j].tagsLevel2.push(tagOther);
                this.addToModified(i, result.requestTag);
                return;
              }
            } else if (tempValue.localeCompare(otherValue) < 0) {
              let val2_5 = null;
              let tag2_3 = null;
              const val1_1: Value = {
                value: result.requestValue,
                newValue: result.requestValue,
                edited: false,
                deleted: false,
                added: true,
                date: new Date(),
                tagsLevel2: null
              };

              if (
                result.requestTagLevel2 !== '' &&
                result.requestValueLevel2 !== ''
              ) {
                val2_5 = {
                  value: result.requestValueLevel2,
                  newValue: result.requestValueLevel2,
                  edited: false,
                  deleted: false,
                  added: true,
                  date: new Date()
                };
                tag2_3 = {
                  tag: result.requestTagLevel2,
                  deleted: false,
                  added: true,
                  valuesLevel2: [],
                  date: new Date()
                };
                tag2_3.valuesLevel2.push(val2_5);
                val1_1.tagsLevel2 = [];
                val1_1.tagsLevel2.push(tag2_3);
              }
              this.tagValues[i].values.splice(j, 0, val1_1);
              this.addToModified(i, result.requestTag);
              return;
            }
          }

          let val2_6 = null;
          let tag2_4 = null;
          const val1_2: Value = {
            value: result.requestValue,
            newValue: result.requestValue,
            edited: false,
            deleted: false,
            added: true,
            date: new Date(),
            tagsLevel2: null
          };

          if (
            result.requestTagLevel2 !== '' &&
            result.requestValueLevel2 !== ''
          ) {
            val2_6 = {
              value: result.requestValueLevel2,
              newValue: result.requestValueLevel2,
              edited: false,
              deleted: false,
              added: true,
              date: new Date()
            };
            tag2_4 = {
              tag: result.requestTagLevel2,
              deleted: false,
              added: true,
              valuesLevel2: [],
              date: new Date()
            };
            tag2_4.valuesLevel2.push(val2_6);
            val1_2.tagsLevel2 = [];
            val1_2.tagsLevel2.push(tag2_4);
          }
          this.tagValues[i].values.push(val1_2);
          this.addToModified(i, result.requestTag);
          return;
        } else if (tempTag.localeCompare(otherTag) < 0) {
          let val2_7 = null;
          let tag2_5 = null;
          const val1_3: Value = {
            value: result.requestValue,
            newValue: result.requestValue,
            edited: false,
            deleted: false,
            added: true,
            date: new Date(),
            tagsLevel2: null
          };
          const tag1_1: Tag = {
            tag: result.requestTag,
            deleted: false,
            added: true,
            date: new Date(),
            values: []
          };

          if (
            result.requestTagLevel2 !== '' &&
            result.requestValueLevel2 !== ''
          ) {
            val2_7 = {
              value: result.requestValueLevel2,
              newValue: result.requestValueLevel2,
              edited: false,
              deleted: false,
              added: true,
              date: new Date()
            };
            tag2_5 = {
              tag: result.requestTagLevel2,
              deleted: false,
              added: true,
              valuesLevel2: [],
              date: new Date()
            };
            tag2_5.valuesLevel2.push(val2_7);
            val1_3.tagsLevel2 = [];
            val1_3.tagsLevel2.push(tag2_5);
          }
          tag1_1.values.push(val1_3);
          this.tagValues.splice(i, 0, tag1_1);
          this.addToModified(i, result.requestTag);
          return;
        }
      }
      let val2_8 = null;
      let tag2_6 = null;
      const val1_4: Value = {
        value: result.requestValue,
        newValue: result.requestValue,
        edited: false,
        deleted: false,
        added: true,
        date: new Date(),
        tagsLevel2: null
      };
      const tag1_2: Tag = {
        tag: result.requestTag,
        deleted: false,
        added: true,
        date: new Date(),
        values: []
      };

      if (
        result.requestTagLevel2 !== '' &&
        result.requestValueLevel2 !== ''
      ) {
        val2_8 = {
          value: result.requestValueLevel2,
          newValue: result.requestValueLevel2,
          edited: false,
          deleted: false,
          added: true,
          date: new Date()
        };
        tag2_6 = {
          tag: result.requestTagLevel2,
          deleted: false,
          added: true,
          valuesLevel2: [],
          date: new Date()
        };
        tag2_6.valuesLevel2.push(val2_8);
        val1_4.tagsLevel2 = [];
        val1_4.tagsLevel2.push(tag2_6);
      }
      tag1_2.values.push(val1_4);
      this.tagValues.push(tag1_2);
      this.addToModified(this.tagValues.length - 1, result.requestTag);
      return;
    });
  }

  addToModified(index: number, requestTag: string) {
      let found = false;
      for (let i = 0; i < this.modifiedTagValues.length; i++) {
        if (this.modifiedTagValues[i].tag === requestTag) {
          found = true;
        }
      }
      if (!found) {
        this.modifiedTagValues.push(this.tagValues[index]);
      }
  }

  addToAutoComplete(requestTag: string, requestTagLevel2: string) {
    let foundTag = false;
    for (let i = 0; i < this.tags.length; i++) {
      if (requestTag.toLowerCase() === this.tags[i].toLowerCase()) {
        foundTag = true;
        break;
      } else if (requestTag.toLowerCase().localeCompare(this.tags[i].toLowerCase()) < 0) {
        this.tags.splice(i, 0, requestTag);
        foundTag = true;
        break;
      }
    }
    if (!foundTag) {
      this.tags.push(requestTag);
    }

    for (let i = 0; i < this.tagsLevel2.length; i++) {
      if (requestTagLevel2.toLowerCase() === this.tagsLevel2[i].toLowerCase()) {
        return;
      } else if (requestTagLevel2.toLowerCase().localeCompare(this.tagsLevel2[i].toLowerCase()) < 0) {
        this.tagsLevel2.splice(i, 0, requestTagLevel2);
        return;
      }
    }
    this.tagsLevel2.push(requestTagLevel2);
  }

  saveChanges() {
    for (let i = 0; i < this.tagValues.length; i++) {
      if (this.tagValues[i].deleted) {
        // const tempActive: CLActive = {
        //   requestTag: this.tagValues[i].tag,
        //   requestValue: null,
        //   requestTagLevel2: null,
        //   requestValueLevel2: null
        // };
        // this.operationService.deleteActiveTag(tempActive).subscribe(status => {
        //   console.log('Status of Deleting Request Tag: ' + status);
        // });
        this.tagValues.splice(i, 1);
        i--;
      } else {
        this.tagValues[i].added = false;
        for (let j = 0; j < this.tagValues[i].values.length; j++) {
          if (this.tagValues[i].values[j].deleted) {
            // const tempActive: CLActive = {
            //   requestTag: this.tagValues[i].tag,
            //   requestValue: this.tagValues[i].values[j].value,
            //   requestTagLevel2: null,
            //   requestValueLevel2: null
            // };
            // this.operationService.deleteActiveValue(tempActive).subscribe(status => {
            //   console.log('Status of Deleting Request Value: ' + status);
            // });
            this.tagValues[i].values.splice(j, 1);
            j--;
          } else {
            if (this.tagValues[i].values[j].tagsLevel2) {
              for (let k = 0; k < this.tagValues[i].values[j].tagsLevel2.length; k++) {
                if (this.tagValues[i].values[j].tagsLevel2[k].deleted) {
                  // const tempActive: CLActive = {
                  //   requestTag: this.tagValues[i].tag,
                  //   requestValue: this.tagValues[i].values[j].value,
                  //   requestTagLevel2: this.tagValues[i].values[j].tagsLevel2[k].tag,
                  //   requestValueLevel2: null
                  // };
                  // this.operationService.deleteActiveTag2(tempActive).subscribe(status => {
                  //   console.log('Status of Deleting Request Tag (level 2): ' + status);
                  // });
                  this.tagValues[i].values[j].tagsLevel2.splice(k, 1);
                  k--;
                } else {
                  this.tagValues[i].values[j].tagsLevel2[k].added = false;
                  for (let l = 0; l < this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2.length; l++) {
                    if (this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].added &&
                      !this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].deleted) {
                      if (this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].newValue !==
                        this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value) {
                        this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value =
                        this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].newValue;
                      }
                      // const tempActive: CLActive = {
                      //   requestTag: this.tagValues[i].tag,
                      //   requestValue: this.tagValues[i].values[j].value,
                      //   requestTagLevel2: this.tagValues[i].values[j].tagsLevel2[k].tag,
                      //   requestValueLevel2: this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value
                      // };
                      // this.operationService.addActive(tempActive).subscribe(status => {
                      //   console.log('Status of Adding (with level 2): ' + status);
                      // });
                      this.tagValues[i].values[j].added = false;
                      this.tagValues[i].values[j].edited = false;
                      this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].added = false;
                      this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].edited = false;
                    } else if (this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].edited &&
                      !this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].deleted) {
                        this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value =
                        this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].newValue;
                        // const tempActive: CLActive = {
                        //   requestTag: this.tagValues[i].tag,
                        //   requestValue: this.tagValues[i].values[j].value,
                        //   requestTagLevel2: this.tagValues[i].values[j].tagsLevel2[k].tag,
                        //   requestValueLevel2: this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value
                        // };
                        // this.operationService.editActive(tempActive).subscribe(status => {
                        //   console.log('Status of Editing (with level 2): ' + status);
                        // });
                        this.tagValues[i].values[j].added = false;
                      this.tagValues[i].values[j].edited = false;
                      this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].edited = false;
                    } else if (this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].deleted) {
                      // const tempActive: CLActive = {
                      //   requestTag: this.tagValues[i].tag,
                      //   requestValue: this.tagValues[i].values[j].value,
                      //   requestTagLevel2: this.tagValues[i].values[j].tagsLevel2[k].tag,
                      //   requestValueLevel2: this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value
                      // };
                      // this.operationService.deleteActiveValue2(tempActive).subscribe(status => {
                      //   console.log('Status of Deleting Request Value (level 2): ' + status);
                      // });
                      this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2.splice(l, 1);
                      l--;
                    }
                  }
                  if (this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2.length === 0) {
                    // const tempActive: CLActive = {
                    //   requestTag: this.tagValues[i].tag,
                    //   requestValue: this.tagValues[i].values[j].value,
                    //   requestTagLevel2: this.tagValues[i].values[j].tagsLevel2[k].tag,
                    //   requestValueLevel2: null
                    // };
                    // this.operationService.deleteActiveTag2(tempActive).subscribe(status => {
                    //   console.log('Status of Deleting Request Tag (level 2): ' + status);
                    // });
                    this.tagValues[i].values[j].tagsLevel2.splice(i, 1);
                    i--;
                  }
                }
              }
            }

            if (this.tagValues[i].values[j].added && !this.tagValues[i].values[j].deleted) {
              if (this.tagValues[i].values[j].newValue !== this.tagValues[i].values[j].value) {
                this.tagValues[i].values[j].value =
                this.tagValues[i].values[j].newValue;
              }
              // const tempActive: CLActive = {
              //   requestTag: this.tagValues[i].tag,
              //   requestValue: this.tagValues[i].values[j].value,
              //   requestTagLevel2: null,
              //   requestValueLevel2: null
              // };
              // this.operationService.addActive(tempActive).subscribe(status => {
              //   console.log('Status of Adding: ' + status);
              // });
              this.tagValues[i].values[j].added = false;
              this.tagValues[i].values[j].edited = false;
            } else if (this.tagValues[i].values[j].edited && !this.tagValues[i].values[j].deleted) {
              this.tagValues[i].values[j].value =
              this.tagValues[i].values[j].newValue;
              // const tempActive: CLActive = {
              //   requestTag: this.tagValues[i].tag,
              //   requestValue: this.tagValues[i].values[j].value,
              //   requestTagLevel2: null,
              //   requestValueLevel2: null
              // };
              // this.operationService.editActive(tempActive).subscribe(status => {
              //   console.log('Status of Editing: ' + status);
              // });
              this.tagValues[i].values[j].edited = false;
            }
          }
        }
        if (this.tagValues[i].values.length === 0) {
        // const tempActive: CLActive = {
        //   requestTag: this.tagValues[i].tag,
        //   requestValue: null,
        //   requestTagLevel2: null,
        //   requestValueLevel2: null
        // };
        // this.operationService.deleteActiveTag(tempActive).subscribe(status => {
        //   console.log('Status of Deleting Request Tag: ' + status);
        // });
          this.tagValues.splice(i, 1);
          i--;
        }
      }
    }
    this.modifiedTagValues = this.tagValues;
  }

  search(input: string) {
    if (input === '') {
      this.modifiedTagValues = this.tagValues;
    } else {
      this.modifiedTagValues = [];
      for (let i = 0; i < this.tagValues.length; i++) {
        let found = false;
        if (this.tagValues[i].tag.toLowerCase().includes(input.toLowerCase())) {
          this.modifiedTagValues.push(this.tagValues[i]);
          found = true;
          continue;
        }
        for (let j = 0; j < this.tagValues[i].values.length; j++) {
          if (this.tagValues[i].values[j].value.toLowerCase().includes(input.toLowerCase()) && !found) {
            this.modifiedTagValues.push(this.tagValues[i]);
            found = true;
            continue;
          }
          if (this.tagValues[i].values[j].tagsLevel2) {
            for (let k = 0; k < this.tagValues[i].values[j].tagsLevel2.length; k++) {
              if (this.tagValues[i].values[j].tagsLevel2[k].tag.toLowerCase().includes(input.toLowerCase()) && !found) {
                this.modifiedTagValues.push(this.tagValues[i]);
                found = true;
                continue;
              }
              for (let l = 0; l < this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2.length; l++) {
                if (this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value.toLowerCase().includes(input.toLowerCase())
                && !found) {
                  this.modifiedTagValues.push(this.tagValues[i]);
                  continue;
                }
              }
            }
          }
        }
      }
    }
}

searchEnter(checked: boolean) {
  this.allSearch = checked;
  this.previous = this.input;
  this.input = '';

  if (this.previous === '') {
    this.modifiedTagValues = this.tagValues;
  } else {
    this.modifiedTagValues = [];
    for (let i = 0; i < this.tagValues.length; i++) {
      let found = false;
      if (this.tagValues[i].tag.toLowerCase().includes(this.previous.toLowerCase())) {
        this.modifiedTagValues.push(this.tagValues[i]);
        found = true;
        continue;
      }
      for (let j = 0; j < this.tagValues[i].values.length; j++) {
        if (this.tagValues[i].values[j].value.toLowerCase().includes(this.previous.toLowerCase()) && !found) {
          this.modifiedTagValues.push(this.tagValues[i]);
          found = true;
          continue;
        }
        if (this.tagValues[i].values[j].tagsLevel2) {
          for (let k = 0; k < this.tagValues[i].values[j].tagsLevel2.length; k++) {
            if (this.tagValues[i].values[j].tagsLevel2[k].tag.toLowerCase().includes(this.previous.toLowerCase()) && !found) {
              this.modifiedTagValues.push(this.tagValues[i]);
              found = true;
              continue;
            }
            for (let l = 0; l < this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2.length; l++) {
              if (this.tagValues[i].values[j].tagsLevel2[k].valuesLevel2[l].value.toLowerCase().includes(this.previous.toLowerCase())
              && !found) {
                this.modifiedTagValues.push(this.tagValues[i]);
                continue;
              }
            }
          }
        }
      }
    }
  }
}


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 0) {
      const element = document.getElementById('navbar');
      element.classList.add('sticky');
    } else {
      const element = document.getElementById('navbar');
      element.classList.remove('sticky');
    }
  }

  download() {
    this.operationService.downloadExcel().subscribe(data => {
      const objectUrl = URL.createObjectURL(data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = objectUrl;
      a.download = 'CL_Request_Non-Static_Values_CLS.xlsx';
      a.click();
    });
  }
}
