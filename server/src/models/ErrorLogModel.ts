import mongoose, { Schema, Document, Model } from "mongoose";
import baseModelSchema from "./BaseModel";

interface IErrorLog extends Document {
  errorCode: string;
  message: string;
  file: string;
  source: string;
  stackTrace: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const errorLogModelSchema = new Schema<IErrorLog>(
  {
    errorCode: { type: String, required: true },
    message: { type: String, required: true },
    file: { type: String, required: true },
    source: { type: String, required: true },
    stackTrace: { type: String, required: true },
    ...baseModelSchema.obj,
  },
  { timestamps: true }
);

const ErrorLogModel: Model<IErrorLog> = mongoose.model<IErrorLog>("ErrorLog", errorLogModelSchema);

export default ErrorLogModel;
