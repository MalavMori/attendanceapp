import StudentModel from "../db/models/studentSchema";
import FacultyModel from "../db/models/facultySchema";
import verifyuser from "../db/verifyuser";
import RegisterModel from "../db/models/registerSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  try {
    const student = await StudentModel.findOne({
      email: userdata.user.email,
    });
    if (student) {
      const facilty = await FacultyModel.find(
        {
          department: student.department,
        },
        { phoneNo: 0, department: 0 }
      );
      if (facilty.length > 0) {
        return Response.json({
          payload: facilty,
          message: "Record found",
          success: true,
        });
      } else {
        return Response.json({
          message: "Record Not found",
          success: true,
        });
      }
    } else {
      return Response.json({
        message: "Student Not Found",
        success: false,
      });
    }
  } catch (error) {
    return Response.json({
      message: "Internal server error",
      success: false,
    });
  }
};
