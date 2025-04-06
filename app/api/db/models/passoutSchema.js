import mongoose, {Schema} from 'mongoose';

const PassOut = new Schema({
  enNo: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: Number, required: true },
  department: { type: String, required: true },
  profile_img: { type: String }

},{versionKey: false});

const PassOutModel = mongoose.models.PassOut || mongoose.model("PassOut",PassOut)


export default PassOutModel