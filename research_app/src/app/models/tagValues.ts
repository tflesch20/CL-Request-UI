export class ValueLevel2 {
  value: string;
  newValue: string;
  edited: boolean;
  deleted: boolean;
  added: boolean;
  date: Date;
}

export class TagLevel2 {
  tag: string;
  deleted: boolean;
  added: boolean;
  valuesLevel2: ValueLevel2[];
  date: Date;
}

export class Value {
  value: string;
  newValue: string;
  edited: boolean;
  deleted: boolean;
  added: boolean;
  date: Date;
  tagsLevel2: TagLevel2[];
}

export class Tag {
  tag: string;
  deleted: boolean;
  added: boolean;
  values: Value[];
  date: Date;
}
