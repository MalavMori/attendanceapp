import verifyuser from "../../db/verifyuser";
import StudentModel from "../../db/models/studentSchema";
import FacultyModel from "../../db/models/facultySchema";
import RequestAuthModel from "../../db/models/requestauthSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  if (userdata.user) {
    try {
      const faculty = await FacultyModel.findOne({
        email: userdata.user.email,
      });
      if (faculty) {
        const requestauth = await RequestAuthModel.find(
          { facultyid: faculty._id },
          { authkey: 0 }
        );
        if (requestauth.length > 0) {
          const studentlist = [
            ...new Set(
              requestauth.map((request) => request.studentid.toString())
            ),
          ];
          const students = await StudentModel.find({
            _id: { $in: studentlist },
          },{authkey:0});
          return Response.json({
            payload: { requestauth, students },
            message: "Record Found",
            success: true,
          });
        } else {
          return Response.json({
            payload: { requestauth: [], students: [] },
            message: "Record Not Found",
            success: true,
          });
        }
      } else {
        return Response.json({
          message: "Faculty Not Found",
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
