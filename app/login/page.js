"use client";
import React, { useEffect, useState } from "react";
import { FloatingIndicator, Tabs, Center, Box, Button } from "@mantine/core";
import classes from "./login.module.css";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import useStore from "@/store";
import { useRouter } from "next/navigation";

const Login = () => {
  const [rootRef, setRootRef] = useState(null);
  const [value, setValue] = useState("1");
  const [controlsRefs, setControlsRefs] = useState({});
  const setControlRef = (val) => (node) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };
  return (
    <>
      <Center w={"100%"} h={"100vh"} bg="var(--mantine-color-gray-light)">
        <Box
          style={{
            borderRadius: 20,
            padding: 10,
            boxShadow: "12px 12px 14px -5px #afafaf",
          }}
          bg="white"
        >
          <Tabs variant="none" value={value} onChange={setValue}>
            <Tabs.List
              style={{ display: "flex", justifyContent: "space-around" }}
              ref={setRootRef}
              className={classes.list}
            >
              <Tabs.Tab
                value="1"
                ref={setControlRef("1")}
                className={classes.tab}
              >
                Student
              </Tabs.Tab>
              <Tabs.Tab
                value="2"
                ref={setControlRef("2")}
                className={classes.tab}
              >
                Faculty
              </Tabs.Tab>

              <FloatingIndicator
                target={value ? controlsRefs[value] : null}
                parent={rootRef}
                className={classes.indicator}
              />
            </Tabs.List>

            <Tabs.Panel value="1">
              <div style={{ display: "grid", justifyContent: "center" }}>
                <div style={{ height: 300, overflow: "hidden" }}>
                  <Image
                    width={300}
                    height={300}
                    alt="image"
                    src={"/vecteezy_teacher-is-teaching-children-in-class_.jpg"}
                  />
                </div>
                <Button
                  onClick={() => {
                    localStorage.setItem("usertype", "student");
                    signIn("google", { callbackUrl: "usertype=student" });
                  }}
                  variant="filled"
                  radius="xl"
                >
                  LogIn As Student
                </Button>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="2">
              <div style={{ display: "grid", justifyContent: "center" }}>
                <div style={{ height: 300, overflow: "hidden" }}>
                  <Image
                    width={300}
                    height={300}
                    alt="image"
                    src={
                      "/vecteezy_the-teacher-is-teaching-with-two-students_8584331.jpg"
                    }
                  />
                </div>
                <Button
                  onClick={() => {
                    localStorage.setItem("usertype", "faculty");
                    signIn("google", { callbackUrl: "usertype=faculty" });
                  }}
                  variant="filled"
                  radius="xl"
                >
                  LogIn As Faculty
                </Button>
              </div>
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Center>
    </>
  );
};

export default Login;
