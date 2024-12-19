import { Schema, Document} from "mongoose";

export interface ISession extends Document {
  userId: Schema.Types.ObjectId;
  ipAddress: string;
  expiresAt: Date;
  userAgent: string;
  browser: {
    name: string,
    version: string
  };
  device: {
    type: string,
    model: string,
    vendor: string
  };
  os: {
    name: string,
    version: string
  };
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
