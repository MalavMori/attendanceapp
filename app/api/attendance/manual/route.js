import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import FacultyModel from "../../db/models/facultySchema";
import verifyuser from "../../db/verifyuser";
import RegisterModel from "../../db/models/registerSchema";
import AttendanceModel from "../../db/models/attendanceSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const {date, students,registerid,classtype} = await req.json();

  if (date && students.length && registerid && classtype ) {
    try {
      const faculty = await FacultyModel.findOne({email:userdata.user.email})
      const register = await RegisterModel.findOne({_id:registerid})
      if (faculty._id.toString() == register.userid.toString()) {
        const attendance = await AttendanceModel({date, students,registerid,classtype})
        await attendance.save()
        return Response.json({message:"Attendence Saved Successfuly",success:true})
      }
    } catch (error) {
      return Response.json({message:"Internal Server Error",success:false})
    }
  }

  return Response.json({message:"Internal Server Error",success:false});
};
