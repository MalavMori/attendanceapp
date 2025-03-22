import mongoose, { Schema } from "mongoose";

const RequestAuth = new Schema(
  {
    facultyid: { type: Schema.ObjectId, required: true },
    studentid: { type: Schema.ObjectId, required: true },
    authkey: { type: String, required: true },
  },
  { versionKey: false }
);

const RequestAuthModel =
  mongoose.models.RequestAuth || mongoose.model("RequestAuth", RequestAuth);

export default RequestAuthModel;
