"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./navbar/NavBar";
import isMobile from "./IsMobile";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import AlertLoading from "./AlertLoading";
import AlertError from "./AlertError";

const WebLayout = ({ children }) => {
  const { status, data } = useSession();
  const [alertbox, setAlertbox] = useState("");
  const setuser = useStore((state) => state.setuser);
  const user = useStore((state) => state.user);
  const setuserprofile = useStore((state) => state.setuserprofile);
  const userprofile = useStore((state) => state.userprofile);
  const [showNavbar, setshowNavbar] = useState(false);
  const router = useRouter();

  const isstatus = async () => {
    let chlocation = location.pathname;
    if (status === "authenticated") {
      setshowNavbar(true);
      if (data?.usertype) {
        localStorage.setItem("usertype", data?.usertype);
      }
      const usertype = localStorage.getItem("usertype");
      if (usertype) {
        setAlertbox(<AlertLoading />);
        let res = await fetch("/api/persondata", {
          method: "POST",
          body: JSON.stringify({
            user: data,
            usertype: usertype,
          }),
        });
        let userdata = await res.json();
        if (userdata.success) {
          setuserprofile(userdata.payload);
          setuser(data);
          setAlertbox("");
        } else {
          setAlertbox(<AlertError title={"Error"} />);
        }
      } else {
        signOut();
      }

      if (chlocation == "/login") {
        router.replace("/");
      } else {
        router.replace(chlocation);
      }
      return true;
    } else {
      setshowNavbar(false);
      if (status === "unauthenticated") {
        router.replace("/login");
      }
      return false;
    }
  };
  useEffect(() => {
    isstatus();
  }, [status]);
  return (
    <>
      <div style={{ backgroundColor: "#f0f0f0" ,minHeight:"100vh"}}>
        {isMobile() ? (
          <>
            {showNavbar ? <NavBar /> : ""}
            {children}
          </>
        ) : (
          <div style={{ display: "flex" }}>
            {showNavbar ? <NavBar /> : ""}
            <div style={{ overflow: "auto", width: "100%", height: "100vh" }}>
              {children}
            </div>
          </div>
        )}
      </div>
      {alertbox}
    </>
  );
};

export default WebLayout;
