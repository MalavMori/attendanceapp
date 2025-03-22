import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../db/models/studentSchema";
import FacultyModel from "../db/models/facultySchema";
import verifyuser from "../db/verifyuser";
import RegisterModel from "../db/models/registerSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  if (userdata.user) {
    try {
      const faclty = await FacultyModel.findOne({ email: userdata.user.email });
      const registers = await RegisterModel.find({ userid: faclty._id });
      return Response.json({
        payload: registers,
        message: "Student Record Stord",
        success: true,
      });
    } catch (error) {
      return Response.json({ message: "Student Record Stord", success: false });
    }
  }
  return Response.json({ message: "Internal Server Error", success: false });
};
