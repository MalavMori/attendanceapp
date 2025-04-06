import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";
import PassOutModel from "../../db/models/passoutSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { selectedRows, updatesemvalue } = await req.json();
  console.log(selectedRows, updatesemvalue);
  try {
    const faclty = await FacultyModel.findOne({ email: userdata.user.email });
    if (faclty) {
      if (updatesemvalue == "PassOut") {
        const students = await StudentModel.find(
          {
            _id: { $in: selectedRows },
            department: faclty.department,
          },
          { _id: 0 }
        );
        const passout = await PassOutModel.insertMany(students);
        const deletestudent = await StudentModel.deleteMany({
          _id: { $in: selectedRows },
          department: faclty.department,
        });
        return Response.json({
          message: "Record Updated",
          success: true,
        });
      } else if (["1", "2", "3", "4", "5", "6"].includes(updatesemvalue)) {
        const updatestudents = await StudentModel.updateMany(
          {
            _id: { $in: selectedRows },
            department: faclty.department,
          },
          {
            $set: {
              sem: updatesemvalue,
            },
          }
        );
      }
      return Response.json({
        message: "Record Updated",
        success: true,
      });
    }
    return Response.json({ message: "Internal server error", success: false });
  } catch (error) {
    return Response.json({
      message: "Internal server error",
      success: false,
    });
  }
};
