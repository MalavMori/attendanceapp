import { NextResponse, NextRequest } from "next/server";
import verifyuser from "@/app/api/db/verifyuser";
import TempAttModel from "@/app/api/db/models/tempattSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { tempAttId } = await req.json();
  if (tempAttId && userdata.user && userdata.usertype == "faculty") {
    try {
        const data = await TempAttModel.findOne({_id:tempAttId},{present:1})
        return Response.json({
          payload: data,
          message: "Record Saved Successfuly",
          success: true,
        });
    } catch (error) {
      return Response.json({
        message: "Internal Server Error",
        success: false,
      });
    }
  }

  return Response.json({ message: "Internal Server Error", success: false });
};
