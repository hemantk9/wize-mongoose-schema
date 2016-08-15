import { Schema as MongooseSchema } from "mongoose";
import { WizeSchema } from "wize-schema";
export declare class WizeSchemaGenerator {
    metadata: WizeSchema;
    schema: MongooseSchema;
    constructor(metadata: WizeSchema);
}
