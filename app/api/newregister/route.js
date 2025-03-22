import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../db/models/studentSchema";
import FacultyModel from "../db/models/facultySchema";
import verifyuser from "../db/verifyuser";
import RegisterModel from "../db/models/registerSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const register = await req.json();
  const { sem, div, subjectname, subjectcode, startdate, enddate, term } =
    register;
  if (
    sem &&
    div &&
    subjectname &&
    subjectcode &&
    startdate &&
    enddate &&
    term
  ) {
    try {
      const faclty = await FacultyModel.findOne({ email: userdata.user.email });
      if (faclty && faclty.department == userdata.userdepartment) {
        const students = await StudentModel.find({
          sem,
          div,
          department: faclty.department,
        }).select({ enNo: 1, _id: 0 });
        const studentsarr = [];
        students.forEach((data) => {
          studentsarr.push(data.enNo);
        });
        const register = new RegisterModel({
          sem,
          div,
          subjectname,
          subjectcode,
          startdate,
          enddate,
          term,
          students: studentsarr,
          userid: faclty._id,
        });
        const recordstatus = await register.save();
        return Response.json({
          payload: recordstatus,
          message: "Student Record Stord",
          success: true,
        });
      }
    } catch (error) {
      return Response.json({
        message: error,
        success: false,
      });
    }
  }
  return Response.json({
    message: "Internal server error",
    success: false,
  });
};
