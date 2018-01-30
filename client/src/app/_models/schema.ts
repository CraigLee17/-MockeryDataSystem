import {User} from "./user";
import {DataType} from "./data.type";

export class Schema {
  id: String;
  name: String;
  user: User;
  count: Number;
  fields: [{
    name: String;
    dataType: DataType,
    option: String,
    blank: Number
  }];
  fileFormat: String;
}
