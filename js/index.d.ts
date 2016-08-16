import { Schema as MongooseSchema } from "mongoose";
import { WizeSchema } from "wize-schema";
export declare class WizeMongooseSchema {
    schema: MongooseSchema;
    constructor(metadata: WizeSchema);
}
