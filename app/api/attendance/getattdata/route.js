import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import FacultyModel from "../../db/models/facultySchema";
import verifyuser from "../../db/verifyuser";
import RegisterModel from "../../db/models/registerSchema";
import AttendanceModel from "../../db/models/attendanceSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  try {
    const student = await StudentModel.findOne({ email: userdata.user.email });
    const register = await RegisterModel.find(
      {
        sem: student.sem,
        div: student.div,
        students: student.enNo,
      },
      { userid: 0, students: 0 }
    );
    const registerslist = [];
    if (register.length > 0) {
      register.forEach((data) => {
        registerslist.push(data._id);
      });
      const attendance = await AttendanceModel.find(
        { registerid: { $in: registerslist }, students: student.enNo },
        { students: 0 }
      );
      if (attendance.length > 0) {
        return Response.json({
          payload: { register, attendance },
          message: "Record Found",
          success: true,
        });
      }
    }
    return Response.json({
      message: "Record Not Found",
      success: false,
    });
  } catch (error) {
    return Response.json({
      message: "Internal server error",
      success: false,
    });
  }

  return Response.json({ Hello: "World" });
};
