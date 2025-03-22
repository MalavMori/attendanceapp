import { NextResponse, NextRequest } from "next/server";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";
import RegisterModel from "../../db/models/registerSchema";
import AttendanceModel from "../../db/models/attendanceSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { updateattdencedata, registerid } = await req.json();
  let insertmany = [];
  if (updateattdencedata.length > 0 && registerid) {
    try {
      const faculty = await FacultyModel.findOne({
        email: userdata.user.email,
      });

      const register = await RegisterModel.findOne({ _id: registerid });

      if (faculty._id.toString() == register.userid.toString()) {
        if (updateattdencedata.length > 0) {
          updateattdencedata.forEach((attdata, index) => {
            if (attdata?.updateOne) {
              attdata.updateOne.filter.registerid = registerid;
            }
            if (attdata?.insertMany) {
              attdata.insertMany.documents.forEach((insertdata) => {
                insertdata.registerid = registerid;
              });
              insertmany = attdata.insertMany.documents;
              updateattdencedata.splice(index, 1);
            }
          });
        }

        let insertdata = {};
        if (insertmany.length > 0) {
          insertdata = await AttendanceModel.insertMany(insertmany);
        }
        const updateattdence = await AttendanceModel.bulkWrite(
          updateattdencedata
        );
        return Response.json({
          payload: { updateattdence, insertdata },
          message: "Attendence Updated",
          success: true,
        });
      }
    } catch (error) {
      return Response.json({
        message: "Internal Server Error",
        success: false,
      });
    }
  }

  return Response.json({
    message: "Internal Server Error",
    success: false,
  });
};
