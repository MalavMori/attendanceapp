"use client";

import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import AttendancePage from "./components/AttendancePage";
import Profile from "./components/Profile";

export default function Home() {
  const [usertype, setUsertype] = useState('')
  useEffect(()=>{
    setUsertype(localStorage.getItem("usertype"))
  })
  return (
    <>
    <Profile self={true} />
    {usertype == "student" ? <AttendancePage /> : ""}
    </>
  );
}
