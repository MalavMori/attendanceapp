import mongoose, { Schema } from "mongoose";

const Faculty = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    profile_img: { type: String },
  },
  { versionKey: false }
);

const FacultyModel =
  mongoose.models.Faculty || mongoose.model("Faculty", Faculty);

export default FacultyModel;
