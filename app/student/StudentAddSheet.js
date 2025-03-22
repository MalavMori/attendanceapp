import {
  Button,
  Center,
  Drawer,
  Paper,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import cx from "clsx";
import React, { useState } from "react";
import Spreadsheet from "react-spreadsheet";
import classes from "./TableScrollArea.module.css";
import AlertLoading from "../components/AlertLoading";
import AlertSuccess from "../components/AlertSuccess";
import AlertError from "../components/AlertError";

const StudentAddSheet = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isspreadsheet, setIsspreadsheet] = useState(true);
  const [studentdata, setStudentdata] = useState([]);
  const [alertbox, setAlertbox] = useState("");

  const [data, setData] = useState([
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
    ],
  ]);

  const datachenge = (e) => {
    const studentdata = [];
    function valid(email) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    }
    setData(e);
    e.forEach((student) => {
      if (
        student[0]?.value &&
        student[1]?.value &&
        student[2]?.value &&
        student[3]?.value &&
        student[4]?.value &&
        student[5]?.value &&
        valid(student[2]?.value)
      ) {
        studentdata.push({
          enNo: student[0]?.value.trim(),
          name: student[1]?.value,
          email: student[2]?.value.trim(),
          phoneNo: student[3]?.value.trim(),
          sem: student[4]?.value.trim(),
          div: student[5]?.value.trim(),
        });
      }
    });
    setStudentdata(studentdata);
  };
  const [scrolled, setScrolled] = useState(false);

  const rows = studentdata.map((row) => (
    <Table.Tr key={row.enNo}>
      <Table.Td>{row.enNo}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.phoneNo}</Table.Td>
      <Table.Td>{row.sem}</Table.Td>
      <Table.Td>{row.div}</Table.Td>
    </Table.Tr>
  ));
  const showPreview = () => {
    isspreadsheet ? setIsspreadsheet(false) : setIsspreadsheet(true);
  };
  const addStudents = async () => {
    if (studentdata.length > 0) {
      setAlertbox(<AlertLoading />)
      const res = await fetch("/api/student/addmany", {
        method: "POST",
        body: JSON.stringify(studentdata),
      });
      const data = await res.json();
      if (data.success) {
        setAlertbox(
          <AlertSuccess
            close={() => setAlertbox("")}
            title={"Done"}
            message={data.message}
          />
        );
      } else {
        setAlertbox(
          <AlertError
            close={() => setAlertbox("")}
            title={"Error"}
            message={data.message}
          />
        );
      }
    }
  };
  return (
    <div style={{ display: "grid", placeItems: "center", margin: "10px 30px" }}>
      <Paper shadow="sm" p="xl" radius="lg">
        <Center w={200} style={{ borderRadius: 20 }} h={100} onClick={open}>
          <Text>Add From Sheet</Text>
        </Center>
      </Paper>
      <Drawer
        position="bottom"
        radius="lg"
        size="auto"
        offset={10}
        opened={opened}
        onClose={close}
      >
        <div style={{ display: "grid", placeItems: "center" }}>
          {isspreadsheet ? (
            <>
              <Spreadsheet
                columnLabels={[
                  "Enrollment",
                  "Name",
                  "Email",
                  "PhoneNo",
                  "Sem",
                  "Div",
                ]}
                onChange={datachenge}
                data={data}
              />
              <Button onClick={showPreview} style={{ margin: 10 }}>
                Preview
              </Button>
            </>
          ) : (
            <>
              <ScrollArea
                style={{ height: "calc(100vh - 200px)", margin: "10px" }}
                onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
              >
                <Table highlightOnHover withTableBorder miw={700}>
                  <Table.Thead
                    className={cx(classes.header, {
                      [classes.scrolled]: scrolled,
                    })}
                  >
                    <Table.Tr>
                      <Table.Th>Enrollment No</Table.Th>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Phone No</Table.Th>
                      <Table.Th>Sem</Table.Th>
                      <Table.Th>Div</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </ScrollArea>
              <div>
                <Button style={{ margin: "0 20px" }} onClick={showPreview}>
                  Go back
                </Button>
                <Button onClick={addStudents}>Submit</Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
      {alertbox}
    </div>
  );
};

export default StudentAddSheet;
