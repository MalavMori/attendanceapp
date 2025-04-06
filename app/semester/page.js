"use client";
import {
  Button,
  Center,
  Checkbox,
  Group,
  MultiSelect,
  Paper,
  ScrollArea,
  Select,
  Table,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import AlertLoading from "../components/AlertLoading";
import AlertSuccess from "../components/AlertSuccess";
import AlertError from "../components/AlertError";

const Semester = () => {
  const [studentsdata, setStudentsdata] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatesemvalue, setUpdatesemvalue] = useState("");
  const [showtable, setShowtable] = useState(false);
  const [alertbox, setAlertbox] = useState("");

  const [finddata, setFinddata] = useState({
    sem: "",
    div: [],
  });

  const toggleAll = () =>
    setSelectedRows((current) =>
      current.length === studentsdata.length
        ? []
        : studentsdata.map((item) => item._id)
    );

  const updateSem = async () => {
    setAlertbox(<AlertLoading />);

    const res = await fetch("/api/student/updatesemester", {
      method: "POST",
      body: JSON.stringify({
        selectedRows,
        updatesemvalue,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setAlertbox(
        <AlertSuccess
          title={"Done"}
          message={data.message}
          close={() => {
            setAlertbox("");
          }}
        />
      );
    } else {
      setAlertbox(
        <AlertError
          title={"Error"}
          message={data.message}
          close={() => {
            setAlertbox("");
          }}
        />
      );
    }
  };
  const getstudentsdata = async () => {
    if (finddata.sem && finddata.div.length > 0) {
      setAlertbox(<AlertLoading />);
      const res = await fetch("/api/student/getsemdiv", {
        method: "POST",
        body: JSON.stringify({
          finddata,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertbox(
          <AlertSuccess
            title={"Done"}
            message={data.message}
            close={() => {
              setAlertbox("");
            }}
          />
        );
        setStudentsdata(data.payload);
        setShowtable(true);
      } else {
        setAlertbox(
          <AlertError
            title={"Error"}
            message={data.message}
            close={() => {
              setAlertbox("");
            }}
          />
        );
      }
    }
  };
  return (
    <>
      <div style={{ padding: "10px" }}>
        <Center style={{ marginBottom: "10px" }}>
          <Paper p={"md"} radius={"md"} shadow="md">
            <Select
              label={"Sem"}
              name={"sem"}
              data={["1", "2", "3", "4", "5", "6"]}
              value={finddata.sem}
              onChange={(value) => setFinddata({ ...finddata, sem: value })}
            />
            <MultiSelect
              label={"Div"}
              name={"div"}
              data={["1", "2", "3"]}
              value={finddata.div}
              style={{ margin: "10px 0" }}
              onChange={(value) => setFinddata({ ...finddata, div: value })}
            />
            <Center>
              <Button onClick={getstudentsdata}>Find Students</Button>
            </Center>
          </Paper>
        </Center>
        {showtable && (
          <div>
            <ScrollArea>
              <Paper p={"sm"} shadow="md" radius={"md"}>
                <Table miw={600} highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Sr</Table.Th>
                      <Table.Th>
                        <Group>
                          <Checkbox
                            onChange={toggleAll}
                            checked={
                              selectedRows.length === studentsdata.length
                            }
                            indeterminate={
                              selectedRows.length > 0 &&
                              selectedRows.length !== studentsdata.length
                            }
                          />
                          Enrollment No
                        </Group>
                      </Table.Th>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Sem</Table.Th>
                      <Table.Th>Div</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {studentsdata.map((student, index) => {
                      return (
                        <Table.Tr
                          key={student._id}
                          bg={
                            selectedRows.includes(student._id)
                              ? "var(--mantine-color-blue-light)"
                              : undefined
                          }
                        >
                          <Table.Td>{index + 1}</Table.Td>
                          <Table.Td>
                            <Group>
                              <Checkbox
                                aria-label="Select row"
                                checked={selectedRows.includes(student._id)}
                                onChange={(event) =>
                                  setSelectedRows(
                                    event.currentTarget.checked
                                      ? [...selectedRows, student._id]
                                      : selectedRows.filter(
                                          (position) => position !== student._id
                                        )
                                  )
                                }
                              />
                              {student.enNo}
                            </Group>
                          </Table.Td>
                          <Table.Td>{student.name}</Table.Td>
                          <Table.Td>{student.sem}</Table.Td>
                          <Table.Td>{student.div}</Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </Paper>
            </ScrollArea>
            <Center>
              <Paper
                p={"md"}
                style={{ marginTop: "10px" }}
                shadow="md"
                radius={"md"}
              >
                <Select
                  label={"Sem"}
                  name={"sem"}
                  data={["1", "2", "3", "4", "5", "6", "PassOut"]}
                  value={updatesemvalue}
                  onChange={(value) => {
                    setUpdatesemvalue(value);
                  }}
                />
                <Center style={{ marginTop: "10px" }}>
                  <Button onClick={updateSem}>Submit</Button>
                </Center>
              </Paper>
            </Center>
          </div>
        )}
        {alertbox}
      </div>
    </>
  );
};

export default Semester;
