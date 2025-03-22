"use client";
import React, { useEffect, useState } from "react";
import cx from "clsx";
import {
  Avatar,
  Button,
  Checkbox,
  Group,
  Paper,
  ScrollArea,
  Select,
  Table,
  Text,
} from "@mantine/core";
import classes from "./TableSelection.module.css";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import AlertSuccess from "@/app/components/AlertSuccess";
import AlertError from "@/app/components/AlertError";
import AlertLoading from "@/app/components/AlertLoading";

const formatDate = (date) => {
  const newdate = new Date(date);
  return `${newdate.getFullYear()}/${
    newdate.getMonth() + 1
  }/${newdate.getDate()}`;
};

const ManualAtt = ({ params }) => {
  const [studentsdata, setstudentsdata] = useState([]);
  const [selection, setSelection] = useState([""]);
  const [registerdata, setRegisterdata] = useState({});
  const [classtype, setClasstype] = useState("");
  const [alertbox, setAlertbox] = useState("");
  const router = useRouter();

  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === studentsdata.length
        ? []
        : studentsdata.map((item) => item._id)
    );
  const getstudentdetail = async () => {
    setAlertbox(<AlertLoading />);
    const res = await fetch(
      "/api/attendance/getstudents",
      {
        method: "POST",
        body: JSON.stringify({
          registerid: (await params).manual,
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setstudentsdata(data.payload.students);
      setRegisterdata(data.payload.register);
      setAlertbox(
        <AlertSuccess
          title={"Done"}
          close={() => {
            setAlertbox("");
          }}
          message={data.message}
        />
      );
    } else {
      setAlertbox(
        <AlertError
          title={"Error"}
          close={() => {
            setAlertbox("");
          }}
          message={data.message}
        />
      );
    }
  };

  const saveAttendance = async () => {
    const studentattarr = [];
    studentsdata.forEach((student) => {
      if (selection.includes(student._id)) {
        studentattarr.push(student.enNo);
      }
    });
    const registerid = (await params).manual;
    if (studentattarr.length && registerid && classtype) {
      setAlertbox(<AlertLoading />);

      const res = await fetch("/api/attendance/manual", {
        method: "POST",
        body: JSON.stringify({
          date: DateTime.now().toFormat("yyyy/MM/dd"),
          students: studentattarr,
          registerid: registerid,
          classtype: classtype,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertbox(
          <AlertSuccess
            title={"Done"}
            close={() => {
              setAlertbox("");
            }}
            message={data.message}
          />
        );
        router.replace("/register");
      } else {
        setAlertbox(
          <AlertError
            title={"Error"}
            close={() => {
              setAlertbox("");
            }}
            message={data.message}
          />
        );
      }
    }
  };

  const rows = studentsdata.map((item) => {
    const selected = selection.includes(item._id);
    return (
      <Table.Tr
        key={item._id}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <Table.Td>
          <Checkbox
            checked={selection.includes(item._id)}
            onChange={() => toggleRow(item._id)}
          />
        </Table.Td>
        <Table.Td>{item.enNo}</Table.Td>
        <Table.Td>
          <Text size="sm" fw={500}>
            {item.name}
          </Text>
        </Table.Td>
        <Table.Td>{item.email}</Table.Td>
      </Table.Tr>
    );
  });

  useEffect(() => {
    getstudentdetail();
  }, []);
  return (
    <>
      <Paper shadow="sm" radius="lg" p="xl" style={{ margin: "10px" }}>
        <Text>Subject Name: {registerdata?.subjectname}</Text>
        <Text>Sem: {registerdata?.sem}</Text>
        <Text>Div: {registerdata?.div}</Text>
        <Text>Term: {registerdata?.term}</Text>
        <Text>Date: {new Date().toLocaleDateString()}</Text>
        <Select
          maw={100}
          label="Lec/Lab"
          placeholder="Lec/Lab"
          onChange={setClasstype}
          data={["Lec", "Lab"]}
        />
      </Paper>
      <ScrollArea>
        <Paper shadow="sm" radius="lg" p="xl" style={{ margin: "10px" }}>
          <Table miw={800} verticalSpacing={"sm"}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={40}>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === studentsdata.length}
                    indeterminate={
                      selection.length > 0 &&
                      selection.length !== studentsdata.length
                    }
                  />
                </Table.Th>
                <Table.Th>Enrollment No</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Paper>
      </ScrollArea>
      <Group justify="center" style={{ margin: "10px 0" }}>
        <Button onClick={saveAttendance}>Submit</Button>
      </Group>
      {alertbox}
    </>
  );
};

export default ManualAtt;
