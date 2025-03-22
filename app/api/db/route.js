import { NextResponse, NextRequest } from "next/server";
import FacultyModel from "./models/facultySchema";
import StudentModel from "./models/studentSchema";

export const GET = async (req, res) => {
  
  const f1 = new FacultyModel({
    firstname:"Malav",
    lastname:"Mori",
    email:"malavmori24@gmail.com",
    phoneNo:"6351065086",
    department:"Computer Engineering",
    profile_img:""
  })
  f1.save()
  // const data = await FacultyModel.findOne({email:"malavmori24@gmail.com"})
  // const student = new StudentModel({enNo:"236458307014",name:"Shohan Sharma",email:"shohansharma@gmail.com",phoneNo:"1234567890",profile_img:"",sem:5,div:3,bssid:""})
  // await student.save()
  // const search = "5234"
  // const result = await StudentModel.find({
  //   $or: [
  //     { name: new RegExp(search, 'i') },
  //     { email: new RegExp(search, 'i') },
  //     { enNo: new RegExp(search, 'i') },
  //     { phoneNo: new RegExp(search, 'i') },
  //   ]
  // })
  return Response.json({Hello:"World"});
};
