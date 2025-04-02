import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";
import RegisterModel from "../../db/models/registerSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { registerid, student } = await req.json();

  if ((userdata.user && userdata.usertype == "faculty", student)) {
    try {
      const faclty = await FacultyModel.findOne({ email: userdata.user.email });
      if (faclty) {
        const register = await RegisterModel.findOne({ _id: registerid });
        if (register.userid.toString() == faclty._id.toString()) {
          const updateregister = await RegisterModel.updateOne(
            {
              _id: registerid,
            },
            { $pull: { students: student.enNo } }
          );
          return Response.json({
            message: "Student Deleted",
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
