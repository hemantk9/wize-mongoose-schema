"use strict";
const mongoose_1 = require("mongoose");
const moment = require("moment");
class WizeSchemaGenerator {
    constructor(metadata) {
        this.metadata = metadata;
        let schemaObject = {};
        metadata.columns.forEach(function (column) {
            if (column.name != '_id') {
                let field;
                switch (column.type) {
                    case 'String':
                        field.type = String;
                        if (column.trim) {
                            field.trim = true;
                        }
                        column.letterCase == 'L' ? field.lowercase = true : '';
                        column.letterCase == 'U' ? field.uppercase = true : '';
                        break;
                    case 'Number':
                        field.type = Number;
                        break;
                    case 'Array':
                        field.type = Array;
                        break;
                    case 'Object':
                        field.type = Object;
                        break;
                    case 'Date':
                        field.type = Date;
                        break;
                    case 'Boolean':
                        field.type = Boolean;
                        break;
                    case 'CODE':
                        field.type = String;
                        break;
                    case 'Ref_One':
                        field.type = mongoose_1.Schema.Types.ObjectId;
                        field.ref = column.ref;
                        break;
                    case 'Ref_Many':
                        field.type = [{ type: mongoose_1.Schema.Types.ObjectId, ref: column.ref }];
                        break;
                }
                field.required = column.required == true;
                if (column.enum && column.enum.length > 0) {
                    field.enum = column.enum;
                }
                if (column.unique) {
                    field.unique = column.unique == true;
                }
                else if (column.index) {
                    field.index = (column.index == true);
                }
                if (column.default || column.type == 'Boolean' || (column.default == "" && field.enum && field.enum.length > 0)) {
                    try {
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
                                }
                                else {
                                    field.default = defaultValue;
                                }
                                break;
                            case 'Date':
                                if (column.default == 'curr_date') {
                                    field.default = Date.now;
                                }
                                else if (moment(column.default).isValid()) {
                                    field.default = column.default;
                                }
                                else {
                                    throw new Error();
                                }
                                break;
                            case 'Boolean':
                                if (column.default === "true" || column.default === true) {
                                    field.default = true;
                                }
                                else if (column.default === "false" || column.default === false) {
                                    field.default = false;
                                }
                                break;
                            case 'CODE':
                                field.default = '';
                                break;
                            default:
                                throw new Error();
                        }
                    }
                    catch (error) {
                        console.log('ProjectName:', metadata.projectName, 'TableName', metadata.tableName, 'Column Name', column.name, "has type(", column.type, ") And having default Value ", column.default, error);
                    }
                }
                schemaObject[column.name] = field;
            }
        });
        this.schema = new mongoose_1.Schema(schemaObject);
        this.schema.static('removeById', function (_id, callback) {
            this.remove({ _id: new mongoose_1.Types.ObjectId(_id) }, callback);
        });
    }
}
exports.WizeSchemaGenerator = WizeSchemaGenerator;
//# sourceMappingURL=index.js.map