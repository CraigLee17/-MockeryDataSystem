import {User} from "./user";
import {DataType} from "./data.type";

export class Schema {
  name: String;
  user: User;
  count: Number;
  fields: [{
    name: String;
    dataType: DataType
  }];
  fileFormat: String;
}
