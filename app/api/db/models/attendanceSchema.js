import mongoose, { Schema } from "mongoose";

const Attendance = new Schema(
  {
    registerid: { type: Schema.ObjectId, required: true },
    students: { type: [Number], required: true },
    date: { type: Date, required: true },
    classtype: { type: String, required: true },
  },
  { versionKey: false }
);
Attendance.index({registerid:1,date:1,classtype:1},{unique:true})

const AttendanceModel =
  mongoose.models.Attendance || mongoose.model("Attendance", Attendance);

export default AttendanceModel;
