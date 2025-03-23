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
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      },{authkey:0});
      console.log(result)
      return Response.json(result);
    } else {
      return Response.json([]);
    }
  } catch (error) {
    console.log(error)
    return Response.json([]);
  }
};
