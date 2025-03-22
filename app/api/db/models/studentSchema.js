import mongoose, {Schema} from 'mongoose';

const Student = new Schema({
  enNo: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: Number, required: true, unique: true },
  department: { type: String, required: true },
  profile_img: { type: String },
  sem: { type: Number , required: true},
  div: { type: Number , required: true},
  bssid: { type: String },
  authkey: { type: String },

},{versionKey: false});

const StudentModel = mongoose.models.Student || mongoose.model("Student",Student)


export default StudentModel