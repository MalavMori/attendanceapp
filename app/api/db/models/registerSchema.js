import mongoose, { Schema } from "mongoose";

const Register = new Schema(
  {
    sem: { type: Number, required: true },
    div: { type: Number, required: true },
    subjectname: { type: String, required: true },
    subjectcode: { type: Number, required: true },
    term: { type: Number, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    userid: { type: Schema.ObjectId, required: true },
    students: { type: [Number], required: true },
    workingDaysLab: { type: [String] },
    nonworkingdateLab: { type: [Date] },
    workingDaysLec: { type: [String] },
    nonworkingdateLec: { type: [Date] },
  },
  { versionKey: false }
);

const RegisterModel =
  mongoose.models.Register || mongoose.model("Register", Register);

export default RegisterModel;
