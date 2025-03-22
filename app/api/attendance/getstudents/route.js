import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import FacultyModel from "../../db/models/facultySchema";
import verifyuser from "../../db/verifyuser";
import RegisterModel from "../../db/models/registerSchema";
import AttendanceModel from "../../db/models/attendanceSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const data = await req.json();

  if (data.registerid) {
    try {
        const faculty = await FacultyModel.findOne({email:userdata.user.email})
        const register = await RegisterModel.findOne({_id:data.registerid,userid:faculty._id})
        if (register) {
          if (data?.withatt) {
            const attendecne = await AttendanceModel.find({registerid:register._id})
            const students = await StudentModel.find({enNo: {$in:register.students }},{authkey:0})
            return Response.json({payload:{students,register,attendecne},message:"Done",success: true})
          }else{
            const students = await StudentModel.find({enNo: {$in:register.students }})
            return Response.json({payload:{students,register},message:"Done",success: true})
          }
        }else{
            return Response.json({message:"Some thing whent wrong",success: false})
        }
    } catch (error) {
        return Response.json({message:"Some thing whent wrong",success: false})
    }
  }

  return Response.json({ Hello: "World" });
};
