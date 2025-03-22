"use client";
import {
  Button,
  Divider,
  Group,
  Paper,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconCheckupList,
  IconDotsVertical,
  IconPassword,
  IconPlus,
  IconQrcode,
  IconWifi,
} from "@tabler/icons-react";
import { Menu, useMantineTheme } from "@mantine/core";
import {
  IconCalendar,
  IconChevronDown,
  IconPackage,
  IconSquareCheck,
  IconUsers,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AlertLoading from "../components/AlertLoading";
import AlertError from "../components/AlertError";
import AlertSuccess from "../components/AlertSuccess";
import AttMenu from "./AttMenu";

const Register = () => {
  const theme = useMantineTheme();
  const [registerdata, setRegisterdata] = useState([]);
  const [alertbox, setAlertbox] = useState("");

  const router = useRouter();
  const getregisterdata = async () => {
    setAlertbox(<AlertLoading />);
    const res = await fetch("/api/register", {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      setAlertbox("");
      setRegisterdata(data.payload);
    } else {
      setAlertbox(<AlertError title={"Error"} close={()=>{setAlertbox("")}} message={data.message} />);
    }
  };
  useEffect(() => {
    getregisterdata();
  }, []);

  return (
    <div style={{ padding: "10px" }}>
      <Button
        onClick={() => {
          router.push("/register/newregister");
        }}
        leftSection={<IconPlus size={14} />}
      >
        New Register
      </Button>
      <Divider my="md" />
      <Group>
        {registerdata.map((register) => (
          <Paper
            key={register._id}
            radius="md"
            withBorder
            shadow="md"
            p="lg"
            bg="var(--mantine-color-body)"
          >
            <Text fz="sm" fw={500}>
              Subject Name: {register.subjectname}
            </Text>
            <Text fz="sm" fw={500}>
              Sem: {register.sem}
            </Text>
            <Text fz="sm" fw={500}>
              Div: {register.div}
            </Text>
            <Text fz="sm" fw={500}>
              Subject Code: {register.subjectcode}
            </Text>
            <Text fz="sm" fw={500}>
              Term: {register.term}
            </Text>
            <Group justify="space-between" style={{marginTop:"5px"}}>
              <Button
                variant="outline"
                onClick={() => {
                  router.push(`/register/${register._id}`);
                }}
              >
                Open
              </Button>
              <AttMenu
                target={
                  <IconDotsVertical style={{ cursor: "pointer" }} size={20} />
                }
                registerid={register._id}
              />
            </Group>
          </Paper>
        ))}
      </Group>
      {alertbox}
    </div>
  );
};

export default Register;
