import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../../db/models/studentSchema";
import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";

function valid(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
export const POST = async (req, res) => {
  const studentdata = await req.json();
  const userdata = verifyuser({ req });

  let datastatus = true;
  studentdata.forEach((student, index) => {
    if (
      !student.enNo &&
      !student.name &&
      !student.email &&
      !student.phoneNo &&
      !student.sem &&
      !student.div &&
      !valid(student.email)
    ) {
      datastatus = false;
    }
    studentdata[index].department = userdata.userdepartment;
    studentdata[index].profile_img = "";
    studentdata[index].bssid = "";
  });
  if (datastatus) {
    try {
      const faculty = await FacultyModel.findOne({
        email: userdata.user.email,
      });
      if (faculty && faculty.department == userdata.userdepartment) {
        const addstudents = await StudentModel.insertMany(studentdata);
        return Response.json({
          message: "Students Record Stord",
          success: true,
        });
      }
    } catch (error) {
      return Response.json({
        message: error?.errorResponse?.message,
        success: false,
      });
    }
  }
};
