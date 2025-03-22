"use client";
import { useSession } from "next-auth/react";
import isMobile from "../IsMobile";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const NavBar = () => {
  
  return <>{isMobile() ? <TopBar /> : <Sidebar ispc={true} />}</>;
};

export default NavBar;
