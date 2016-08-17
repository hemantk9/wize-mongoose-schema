import { Schema as MongooseSchema } from "mongoose";
import { WizeSchema } from "wize-schema";
export declare function createSchema(metadata: WizeSchema): MongooseSchema;
export declare function createHistorySchema(schemaName: string): MongooseSchema;
