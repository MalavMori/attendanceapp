import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { studentid } = await req.json();
  try {
    const faclty = await FacultyModel.findOne({ email: userdata.user.email });
    if (faclty) {
      const student = await StudentModel.findOne(
        {
          _id: studentid  ,
          department: faclty.department,
        },
        { authkey: 0 }
      );
      if (student) {
        const deletestudent = await StudentModel.deleteOne({ _id: studentid});
        return Response.json({
          message: "Record Deleted",
          success: true,
        });
      }
      return Response.json({ message: "No Record Found", success: false });
    }
    return Response.json({ message: "Something went worng", success: false });
  } catch (error) {

    return Response.json({
      message: "Internal server error",
      success: false,
    });
  }
};
