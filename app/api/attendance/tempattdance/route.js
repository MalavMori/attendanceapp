import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import FacultyModel from "../../db/models/facultySchema";
import verifyuser from "../../db/verifyuser";
import RegisterModel from "../../db/models/registerSchema";
import AttendanceModel from "../../db/models/attendanceSchema";
import TempAttModel from "../../db/models/tempattSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { date, registerdata, gps, key, classtype, atttype } = await req.json();
  if (date && registerdata && key && classtype && atttype) {
    try {
      const faculty = await FacultyModel.findOne({
        email: userdata.user.email,
      });
      const register = await RegisterModel.findOne({ _id: registerdata._id });
      if (faculty._id.toString() == register.userid.toString()) {
        const tempattendance = await TempAttModel.insertOne({
          registerid: register._id,
          students: register.students,
          registerdata: {
            subjectname: register.subjectname,
            subjectcode: register.subjectcode,
            userid: register.userid,
            sem: register.sem,
            div: register.div,
          },
          present: [],
          date: date,
          classtype,
          key,
          isworking: true,
          isgps: gps,
          atttype,
        });
        const id = (await tempattendance)._id;

        return Response.json({
          payload: id,
          message: "Record Saved Successfuly",
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

  return Response.json({ message: "Internal Server Error", success: false });
};
