import { Mongoose, Schema as MongooseSchema, Types as MongooseTypes } from "mongoose";
import { WizeSchema, MongooseColumn, WizeColumn } from "wize-schema";
import * as moment from "moment";
export function createSchema (metadata: WizeSchema): MongooseSchema {
    let schemaObject: Object = {};
    metadata.columns.forEach(function (column: WizeColumn) {
        if (column.name != '_id') {
            let field: MongooseColumn;
            // switch statement to handle various types of column which can be present in a mongodb model.
            switch (column.type) {
                case 'String' :
                    field.type = String;
                    if (column.trim) {
                        field.trim = true;
                    }
                    column.letterCase == 'L' ? field.lowercase = true : '';
                    column.letterCase == 'U' ? field.uppercase = true : '';
                    break;
                case 'Number' :
                    field.type = Number;
                    break;
                case 'Array' :
                    field.type = Array;
                    break;
                case 'Object' :
                    field.type = Object;
                    break;
                case 'Date' :
                    field.type = Date;
                    break;
                case 'Boolean' :
                    field.type = Boolean;
                    break;
                case 'CODE':
                    field.type = String;
                    break;
                case 'Ref_One' :
                    field.type = MongooseSchema.Types.ObjectId;
                    field.ref = column.ref;
                    break;
                case 'Ref_Many' :
                    field.type = [{type: MongooseSchema.Types.ObjectId, ref: column.ref}];
                    break;
            }
            // apply the required constaint in field if required flag is true.
            field.required = column.required == true;
            // if column has some enum values, apply that constraint to the field.
            if (column.enum && column.enum.length > 0) {
                field.enum = column.enum;
            }
            // generate index on the field
            if (column.unique) {
                field.unique = column.unique == true;
            } else if (column.index) {
                field.index = (column.index == true);
            }

            // if column has default value, apply that default field to mongoose instance.
            if (column.default || column.type == 'Boolean' || (column.default == "" && field.enum && field.enum.length > 0)) {
                try {
                    // switch statement to handle default values for various types of columns.
                    switch (column.type) {
                        case 'String':
                            field.default = String(column.default).trim();
                            field.default = column.letterCase == 'L' ? field.default.toLowerCase() : field.default;
                            field.default = column.letterCase == 'U' ? field.default.toUpperCase() : field.default;
                            break;
                        case 'Number':
                            let defaultValue = Number.parseInt(column.default);
                            if (isNaN(defaultValue)) {
                                throw new Error();
                            } else {
                                field.default = defaultValue;
                            }
                            break;
                        case 'Date':
                            if (column.default == 'curr_date') {
                                field.default = Date.now;
                            } else if (moment(column.default).isValid()) {
                                field.default = column.default;
                            } else {
                                throw new Error();
                            }
                            break;
                        case 'Boolean':
                            if (column.default === "true" || column.default === true) {
                                field.default = true;
                            } else if (column.default === "false" || column.default === false) {
                                field.default = false;
                            }
                            break;
                        case 'CODE':
                            field.default = '';
                            break;
                        default :
                            throw new Error();
                    }
                } catch (error) {
                    console.log('ProjectName:', metadata.projectName, 'TableName', metadata.tableName, 'Column Name', column.name, "has type(", column.type, ") And having default Value ", column.default, error);
                }
            }
            schemaObject[column.name] = field;
        }
    });
    // Create the mongoose schema instance for the model from the metadata
    let schema: MongooseSchema = new MongooseSchema(schemaObject);
    schema.static('removeById', function (_id, callback) {
        this.remove({_id: new MongooseTypes.ObjectId(_id)}, callback);
    });
    return schema;
}
export function createHistorySchema (schemaName: string): MongooseSchema {
    return new MongooseSchema({
        diff: {type: {}, required: true},
        createdAt: {type: Number, required: true, default: Date.now},
        identifier: {type:MongooseTypes.ObjectId, ref: schemaName},
        email: {type: String}
    });
}