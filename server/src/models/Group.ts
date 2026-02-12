import mongoose, { Schema, Document } from "mongoose";

export interface IScheduleSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface IGroup extends Document {
  name: string;
  schedule: IScheduleSlot[];
  subscriptionPrice: number;
}

const ScheduleSlotSchema = new Schema<IScheduleSlot>(
  {
    dayOfWeek: { type: Number, required: true, min: 1, max: 7 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    schedule: [ScheduleSlotSchema],
    subscriptionPrice: { type: Number, default: 5000 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.groupId = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual to get group's children
GroupSchema.virtual("children", {
  ref: "Child",
  localField: "_id",
  foreignField: "groupId",
});

export default mongoose.model<IGroup>("Group", GroupSchema);
