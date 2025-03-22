import verifyuser from "../../db/verifyuser";
import StudentModel from "../../db/models/studentSchema";
import FacultyModel from "../../db/models/facultySchema";
import RequestAuthModel from "../../db/models/requestauthSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { facultyid } = await req.json();
  if (userdata.user && facultyid && userdata.studentauth) {
    try {
      const student = await StudentModel.findOne({
        email: userdata.user.email,
      });
      if (student) {
        const faculty = await FacultyModel.findOne({ _id: facultyid });
        if (faculty) {
          const requestAuth = await RequestAuthModel.insertOne({
            facultyid: faculty._id,
            studentid: student._id,
            authkey: userdata.studentauth,
          });
          return Response.json({
            message: "Record Stored Successfully",
            success: true,
          });
        } else {
          return Response.json({
            message: "Faculty Not Found",
            success: false,
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
        message: "Internal Server Error",
        success: false,
      });
    }
  }

  return Response.json({ message: "Internal Server Error", success: false });
};
