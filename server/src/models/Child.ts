import mongoose, { Schema, Document } from "mongoose";

export interface IChild extends Document {
  name: string;
  dateOfBirth?: string;
  parent?: string;
  address?: string;
  phoneNumber?: number;
  healthCertificate: boolean;
  note?: string;
  groupId?: mongoose.Types.ObjectId;
  isPriority: boolean;
}

const ChildSchema = new Schema<IChild>(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String },
    parent: { type: String },
    address: { type: String },
    phoneNumber: { type: Number },
    healthCertificate: { type: Boolean, default: false },
    note: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    isPriority: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model<IChild>("Child", ChildSchema);
