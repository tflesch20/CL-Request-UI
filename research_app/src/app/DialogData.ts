import {Tag} from './models/index';
export interface DialogData {
  requestTag: string;
  requestValue: string;
  requestTagLevel2: string;
  requestValueLevel2: string;
  tagTable: string[];
  tag2Table: string[];
  tagValues: Tag[];
}
