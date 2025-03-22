import verifyuser from "@/app/api/db/verifyuser";
import { NextResponse, NextRequest } from "next/server";
import FacultyModel from "@/app/api/db/models/facultySchema";
import RegisterModel from "@/app/api/db/models/registerSchema";
import AttendanceModel from "@/app/api/db/models/attendanceSchema";
import TempAttModel from "@/app/api/db/models/tempattSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { isworking, tempAttId } = await req.json();

  try {
    const faculty = await FacultyModel.findOne({
      email: userdata.user.email,
    });
    const tempatt = await TempAttModel.findOne({ _id: tempAttId });
    if (faculty._id.toString() == tempatt.registerdata.userid.toString()) {
      await TempAttModel.updateOne(
        { _id: tempAttId },
        { $set: { isworking: isworking } }
      );
      return Response.json({
        message: "Done",
        success: true,
      });
    }
  } catch (error) {
    return Response.json({
      message: "Internal Server Error",
      success: false,
    });
  }

  return Response.json({ message: "Internal Server Error", success: false });
};
