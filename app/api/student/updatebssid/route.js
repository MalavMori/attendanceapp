import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { data, type } = await req.json();
  try {
    const faclty = await FacultyModel.findOne({ email: userdata.user.email });
    if (faclty) {
      if (type === "ONE") {
        const students = await StudentModel.updateOne(
          {
            enNo: data.enNo,
            department: faclty.department,
          },
          {
            $set: {
              bssid: data.bssid,
            },
          }
        );
        return Response.json({ message: "Updated", success: true });
      } else if (type === "MANY") {
        if (data.length > 0) {
          const bulkUpdate = [];
          data.forEach((record) => {
            bulkUpdate.push({
              updateOne: {
                filter: { enNo: record.enNo, department: faclty.department },
                update: { $set: { bssid: record.bssid } },
              },
            });
          });
          const updatedata = await StudentModel.bulkWrite(bulkUpdate);
          return Response.json({
            message: "Updated",
            success: true,
          });
        }
      }
      return Response.json({ message: "No Record Found", success: false });
    }
    return Response.json({ message: "Internal server error", success: false });
  } catch (error) {
    return Response.json({
      message: "Internal server error",
      success: false,
    });
  }
};
