import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../db/models/studentSchema";
import verifyuser from "../db/verifyuser";
import TempAttModel from "../db/models/tempattSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  if (userdata.user) {
    try {
      const student = await StudentModel.findOne({
        email: userdata.user.email,
      });
      const tempattendance = await TempAttModel.find(
        {
          students: student.enNo,
        },
        { students: 0, present: 0, key: 0, isworking: 0, registerdata:{userid:0} }
      );
      if (tempattendance.length > 0) {
        return Response.json({
          payload: tempattendance,
          message: "Record found",
          success: true,
        });
      } else {
        return Response.json({
          payload: tempattendance,
          message: "No Record found",
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
