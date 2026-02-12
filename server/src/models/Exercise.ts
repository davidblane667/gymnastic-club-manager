import mongoose, { Schema, Document } from "mongoose";

export type TAttendanceStatus = "present" | "absent" | "sick";

export interface IChildAttendance {
  childId: mongoose.Types.ObjectId;
  status: TAttendanceStatus;
}

export interface IExercise extends Document {
  groupId: mongoose.Types.ObjectId;
  date: string;
  attendance: IChildAttendance[];
}

const ChildAttendanceSchema = new Schema<IChildAttendance>(
  {
    childId: { type: Schema.Types.ObjectId, ref: "Child", required: true },
    status: {
      type: String,
      enum: ["present", "absent", "sick"],
      default: "absent",
    },
  },
  { _id: false }
);

const ExerciseSchema = new Schema<IExercise>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    date: { type: String, required: true },
    attendance: [ChildAttendanceSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model<IExercise>("Exercise", ExerciseSchema);
