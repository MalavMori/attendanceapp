"use client";
import React, { useEffect, useState } from "react";

import {
  IconLogout,
  IconSchool,
  IconUserCheck,
  IconUsersGroup,
  IconUserUp,
  IconVocabulary,
} from "@tabler/icons-react";
import { UserButton } from "./UserButton";
import classes from "./NavbarSimple.module.css";
import { Group } from "@mantine/core";
import { Logo } from "./Logo";
import useStore from "@/store";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const facultylinks = [
  { link: "/student", label: "Students", icon: IconUsersGroup },
  { link: "/register", label: "Register", icon: IconVocabulary },
  { link: "/authrequest", label: "Auth Request", icon: IconUserCheck },
  { link: "/semester", label: "Semester", icon: IconSchool },
];
const studentslinks = [
  { link: "/studentattendance", label: "Attendance", icon: IconUserUp },
];
const Sidebar = ({ ispc, closeSideBar = function () {} }) => {
  const [active, setActive] = useState("Billing");
  const router = useRouter();
  const [linksdata, setLinksdata] = useState([])

  const links = linksdata.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        router.push(item.link);
        setActive(item.label);
        closeSideBar();
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));
  useEffect(()=>{
    const usertype = localStorage.getItem("usertype");
    if (usertype === "faculty") {
      setLinksdata(facultylinks)
    }else if (usertype === "student") {
      setLinksdata(studentslinks)
    }
  },[])
  return (
    <>
      <nav
        className={ispc ? classes.navbar : ""}
        style={{ backgroundColor: "white" }}
      >
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="space-between">
            <Logo closeSideBar={closeSideBar} />
          </Group>
          {links}
        </div>
        <></>
        <div className={classes.footer}>
          <UserButton />
          <a
            href="#"
            className={classes.link}
            onClick={(event) => {
              event.preventDefault();
              signOut();
            }}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
