import { model, Schema } from "mongoose";
import { ISession } from "./interfaces/Session/ISession";
import baseModelSchema from "./BaseModel";
const now = new Date();

const sessionSchema = new Schema<ISession>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      required: true, 
      index: true,
      ref: "User",
    },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    browser: {
      name: { type: String, required: true },
      version: { type: String, required: true },
    },
    device: {
      type: { type: String, required: true },
      model: { type: String, required: true },
      vendor: { type: String, required: true },
    },
    os: {
      name: { type: String, required: true },
      version: { type: String, required: true },
    },
    expiresAt: { type: Date, default: new Date(now.setDate(now.getDate() + 30)) },
    ...baseModelSchema.obj,
  },
  { timestamps: true }
);

const sessionModel = model<ISession>("session", sessionSchema);

export default sessionModel;