import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { formData } = await req.json();
  try {
    const faclty = await FacultyModel.findOne({ email: userdata.user.email });
    if (faclty) {
      const student = await StudentModel.findOne(
        {
          _id: formData._id,
          department: faclty.department,
        },
        { authkey: 0 }
      );
      if (student) {
        const updatestudent = await StudentModel.updateOne(
          {
            _id: formData._id,
          },
          {
            enNo: formData.enNo,
            name: formData.name,
            email: formData.email,
            phoneNo: formData.phoneNo,
            sem: formData.sem,
            div: formData.div,
          }
        );
        return Response.json({
          message: "Record Updated",
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
