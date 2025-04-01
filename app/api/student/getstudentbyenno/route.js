import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { studentsEnNoarr } = await req.json();
  try {
    const faclty = await FacultyModel.findOne({ email: userdata.user.email });
    if (faclty) {
      const students = await StudentModel.find(
        { enNo: { $in: studentsEnNoarr }, department: faclty.department },
        { authkey: 0 }
      );
      if (students.length > 0) {
        return Response.json({
          payload: students,
          message: "Record found",
          success: true,
        });
      }
      return Response.json({ message: "No Record Found", success: false });
    }
    return Response.json({ message: "Something went worng", success: false });
  } catch (error) {
    return Response.json({
      message: error.errorResponse.errmsg,
      success: false,
    });
  }
};
