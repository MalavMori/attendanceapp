import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";

function valid(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const studentdata = await req.json();
  if (
    studentdata.enNo &&
    studentdata.name &&
    studentdata.email &&
    studentdata.phoneNo &&
    studentdata.sem &&
    studentdata.div &&
    valid(studentdata.email)
  ) {
    try {
      const faclty = await FacultyModel.findOne({email:userdata.user.email})
      if (faclty && faclty.department == userdata.userdepartment) {
        const res = new StudentModel({
          ...studentdata,
          bssid: "",
          profile_img: "",
          department: userdata.userdepartment,
        });
        const data = await res.save();
        return Response.json({ message: "Student Record Stord", success: true });
      }
    } catch (error) {
      return Response.json({
        message: error.errorResponse.errmsg,
        success: false,
      });
    }
  }
};
