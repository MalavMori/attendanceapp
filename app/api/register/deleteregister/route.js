import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";
import RegisterModel from "../../db/models/registerSchema";
import AttendanceModel from "../../db/models/attendanceSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { registerid } = await req.json();
  if (registerid) {
    try {
      const faclty = await FacultyModel.findOne({ email: userdata.user.email });
      if (faclty) {
        const register = await RegisterModel.findOne({ _id: registerid });
        if (register.userid.toString() == faclty._id.toString()) {
          const deleteattendance = await AttendanceModel.deleteMany({
            registerid: register._id,
          });
          const deleteregister = await RegisterModel.deleteOne({
            _id: registerid,
          });
          return Response.json({
            message: "Deleted",
            success: true,
          });
        }
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
