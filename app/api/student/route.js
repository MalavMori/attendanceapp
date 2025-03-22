import { NextResponse, NextRequest } from "next/server";
import StudentModel from "../db/models/studentSchema";
import verifyuser from "../db/verifyuser";
import FacultyModel from "../db/models/facultySchema";


export const POST = async (req, res) => {
  const data = await req.json();
  try {
    const userdata = verifyuser({ req }).user;
    const isuser = await FacultyModel.findOne({ email: userdata.email });
    if (isuser) {
      const search = data.search;
      const result = await StudentModel.find({
        $or: [
          { name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { $where: "/^" + search + ".*/.test(this.enNo)" },
          { $where: "/^" + search + ".*/.test(this.phoneNo)" },
        ],
      });
      return Response.json(result);
    } else {
      return Response.json([]);
    }
  } catch (error) {
    return Response.json([]);
  }
};
