import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../db/models/studentSchema";
import verifyuser from "../db/verifyuser";
import FacultyModel from "../db/models/facultySchema";

export const POST = async (req, res) => {
  const userdatareq = verifyuser({ req });
  const data = await req.json();
  try {
    if (userdatareq.user && userdatareq.usertype) {
      if (userdatareq.usertype == "faculty") {
        const userdata = await FacultyModel.findOne({
          email: userdatareq.user.email,
        });
        return Response.json({
          payload: userdata,
          message: "Data Found",
          success: true,
        });
      } else if (userdatareq.usertype == "student") {
        const userdata = await StudentModel.findOne(
          {
            email: userdatareq.user.email,
          },
        );
        let isauthenticated = false;
        if (
          userdata.authkey == userdatareq.studentauth &&
          userdatareq.studentauth != ""
        ) {
          isauthenticated = true;
        }
        let userobj = userdata._doc;
        delete userobj.authkey
        return Response.json({
          payload: { ...userobj, isauthenticated },
          message: "Data Found",
          success: true,
        });
      }
    }
  } catch (error) {
    return Response.json({ message: "Error", success: false });
  }
};
