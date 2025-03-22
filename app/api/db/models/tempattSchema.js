import mongoose, { Schema } from "mongoose";

const TempAtt = new Schema(
  {
    registerid: { type: Schema.ObjectId, required: true },
    registerdata:{type:Object,required:true},
    students: { type: [Number], required: true },
    present: { type: [Number], required: true },
    date: { type: Date, required: true },
    classtype: { type: String, required: true },
    atttype:{ type: String, required: true},
    key: { type: String, required: true },
    isworking: { type: Boolean, required: true },
    isgps: { type: Boolean, required: true },
    
  },
  { versionKey: false }
);

const TempAttModel =
  mongoose.models.TempAtt || mongoose.model("TempAtt", TempAtt);

export default TempAttModel;
