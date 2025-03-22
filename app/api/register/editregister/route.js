import verifyuser from "../../db/verifyuser";
import FacultyModel from "../../db/models/facultySchema";
import RegisterModel from "../../db/models/registerSchema";

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const register = await req.json();
  const {
    sem,
    div,
    subjectname,
    subjectcode,
    startdate,
    enddate,
    term,
    registerid,
  } = register;
  if (
    sem &&
    div &&
    subjectname &&
    subjectcode &&
    startdate &&
    enddate &&
    term &&
    registerid
  ) {
    try {
      const faclty = await FacultyModel.findOne({ email: userdata.user.email });
      if (faclty) {
        const register = await RegisterModel.findOne({ _id: registerid });
        if (register.userid.toString() == faclty._id.toString()) {
          const updateregister = await RegisterModel.updateOne(
            { _id: registerid },
            {
              $set: {
                sem,
                div,
                subjectname,
                subjectcode,
                startdate,
                enddate,
                term,
              },
            }
          );
          return Response.json({
            message: "Updated",
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
