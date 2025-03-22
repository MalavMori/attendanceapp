import verifyuser from "../../db/verifyuser";
import StudentModel from "../../db/models/studentSchema";
import FacultyModel from "../../db/models/facultySchema";
import RequestAuthModel from "../../db/models/requestauthSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { requestid } = await req.json();
  if (userdata.user && requestid) {
    try {
      const faculty = await FacultyModel.findOne({
        email: userdata.user.email,
      });
      if (faculty) {
        const authrequest = await RequestAuthModel.findOne({ _id: requestid });

        if (authrequest) {
          if (authrequest.facultyid.toString() == faculty._id.toString()) {
            const saveauth = await StudentModel.updateOne(
              {
                _id: authrequest.studentid,
              },
              { $set: { authkey: authrequest.authkey } }
            );
            const deleterequest = await RequestAuthModel.deleteOne({
              _id: authrequest._id,
            });
            if (saveauth) {
              return Response.json({
                message: "Accepted",
                success: true,
              });
            }
          } else {
            return Response.json({
              message: "Faild to Accept Request",
              success: false,
            });
          }
        } else {
          return Response.json({
            message: "Request Not Found",
            success: false,
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
