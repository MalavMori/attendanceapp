import RegisterModel from "./db/models/registerSchema";
import DB from "./db/connectDB";
import StudentModel from "./db/models/studentSchema";

export async function GET(request) {
  // const register = await RegisterModel.updateOne(
  //   { sem: 6 },
  //   {
  //     $set: {
  //       workingDaysLab: [],
  //       nonworkingdateLab: [],
  //       workingDaysLec: [],
  //       nonworkingdateLec: [],
  //     },
  //   }
  // );
  // const res = await register;
  return Response.json({  });
}
