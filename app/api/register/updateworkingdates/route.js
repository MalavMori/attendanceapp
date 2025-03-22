import { NextResponse, NextRequest } from "next/server";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";
import RegisterModel from "../../db/models/registerSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const data = await req.json();
  if (userdata.user &&  data) {
    try {
      const faculty = await FacultyModel.findOne({
        email: userdata.user.email,
      });
      const register = await RegisterModel.findOne({ _id: data.registerid });
      if (faculty._id.toString() == register.userid.toString()) {
        if (data.classtype == "Lab") {
          await RegisterModel.updateOne(
            { _id: register._id },
            {
              $set: {
                nonworkingdateLab: data.nonworkingdateLab,
                workingDaysLab: data.workingDaysLab,
              },
            }
          );
        } else if (data.classtype == "Lec") {
          await RegisterModel.updateOne(
            { _id: register._id },
            {
              $set: {
                nonworkingdateLec: data.nonworkingdateLec,
                workingDaysLec: data.workingDaysLec,
              },
            }
          );
        }
        return Response.json({ message: "Updated success", success: true })
      }
    } catch (error) {
      return Response.json({ message: "Not Updated", success: false });
    }
  }
  return Response.json({ message: "Internal Server Error", success: false });
};
