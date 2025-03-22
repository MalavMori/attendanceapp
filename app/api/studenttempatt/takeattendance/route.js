import { NextResponse, NextRequest } from "next/server";
import verifyuser from "../../db/verifyuser";
import TempAttModel from "../../db/models/tempattSchema";
import StudentModel from "../../db/models/studentSchema";

class CircularGeofenceRegion {
  constructor(opts) {
    Object.assign(this, opts);
  }

  inside(lat2, lon2) {
    const lat1 = this.latitude;
    const lon1 = this.longitude;
    const R = 63710;

    return (
      Math.acos(
        Math.sin(lat1) * Math.sin(lat2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
      ) *
        R <
      this.radius
    );
  }
}
const fence = new CircularGeofenceRegion({
  name: "Computer Department",
  latitude: 21.7153977659087,
  longitude: 73.00318886559079,
  radius: 65,
});

export const POST = async (req, res) => {
  const userdata = verifyuser({ req });
  const { key, tempattid, coords } = await req.json();

  if (key && tempattid) {
    try {
      const student = await StudentModel.findOne({
        email: userdata.user.email,
      });
      if (student.authkey != userdata.studentauth) {
        return Response.json({
          message: "You are not verified.",
          success: false,
        });
      }
      const tempattendance = await TempAttModel.findOne({ _id: tempattid });
      if (!tempattendance.isworking) {
        return Response.json({
          message: "Closed",
          success: false,
        });
      }
      if (tempattendance.students.includes(student.enNo)) {
        if (!tempattendance.present.includes(student.enNo)) {
          if (key === tempattendance.key) {
            if (tempattendance.isgps) {
              if (fence.inside(coords.lat, coords.lng)) {
                const addstudent = await TempAttModel.updateOne(
                  { _id: tempattid },
                  { $push: { present: student.enNo } }
                );
                return Response.json({
                  message: "Record Saved Successfuly",
                  success: true,
                });
              } else {
                return Response.json({
                  message: "Your are not in location",
                  success: false,
                });
              }
            } else {
              const addstudent = await TempAttModel.updateOne(
                { _id: tempattid },
                { $push: { present: student.enNo } }
              );
              return Response.json({
                message: "Record Saved Successfuly",
                success: true,
              });
            }
          } else {
            return Response.json({
              message: "Pin is wrong",
              success: false,
            });
          }
        } else {
          return Response.json({
            message: "Attendance already taken",
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
