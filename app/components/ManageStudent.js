"use client";
import {
  ActionIcon,
  Center,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowRight,
  IconSearch,
  IconSquarePlus,
  IconTrash,
} from "@tabler/icons-react";
import React, { useState } from "react";
import AlertLoading from "./AlertLoading";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";

const ManageStudent = ({
  studentdata,
  registerdata,
  setstudentdata,
  setregisterdata,
}) => {
  const [searchvalue, setSearchvalue] = useState("");
  const theme = useMantineTheme();
  const [alertbox, setAlertbox] = useState("");
  const [searchresult, setSearchresult] = useState([]);

  const getsearchvalue = (e) => {
    if (e.type != "click") {
      setSearchvalue(e.target.value);
    }
    if (e.key == "Enter" || e.type == "click") {
      setAlertbox(<AlertLoading />);
      fetch("/api/student", {
        method: "POST",
        body: JSON.stringify({
          search: searchvalue,
        }),
      })
        .then(async (data) => {
          const result = await data.json();
          const filterstudents = result.filter(
            (student) => !registerdata.students.includes(student.enNo)
          );
          setSearchresult(filterstudents);
          setAlertbox("");
        })
        .catch((err) => {
        });
    }
  };

  const addStudent = async (enNo, index) => {
    const student = searchresult.find((data) => data.enNo === enNo);
    if (student) {
      setAlertbox(<AlertLoading />);
      const res = await fetch("/api/register/addstudent", {
        method: "POST",
        body: JSON.stringify({
          student,
          registerid: registerdata._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newregister = registerdata;
        newregister.students.push(student.enNo);
        setregisterdata(newregister);

        const newstudentarr = studentdata;
        newstudentarr.push(student);
        setstudentdata(newstudentarr);
        searchresult.splice(index, 1);
        setSearchresult(searchresult);
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
    }
  };

  const removeStudent = async (enNo, index) => {
    const student = studentdata.find((data) => data.enNo === enNo);
    if (student) {
      setAlertbox(<AlertLoading />);
      const res = await fetch("/api/register/removestudent", {
        method: "POST",
        body: JSON.stringify({
          student,
          registerid: registerdata._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newregister = registerdata;
        newregister.students.splice(
          registerdata.students.findIndex((st) => st == enNo),
          1
        );
        setregisterdata(newregister);

        const newstudentarr = studentdata;
        newstudentarr.splice(index, 1);
        setstudentdata(newstudentarr);
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
    }
  };

  const rows = searchresult.map((item, index) => {
    return (
      <Table.Tr key={item.enNo}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Text size="sm" fw={500}>
              {item.enNo}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.name}</Table.Td>
        <Table.Td>{item.sem}</Table.Td>
        <Table.Td>{item.div}</Table.Td>
        <Table.Td>
          {
            <IconSquarePlus
              color="green"
              style={{ cursor: "pointer" }}
              onClick={() => {
                addStudent(item.enNo, index);
              }}
            />
          }
        </Table.Td>
      </Table.Tr>
    );
  });

  const studentsrows = studentdata
    .sort((a, b) => a.enNo - b.enNo)
    .map((item, index) => {
      return (
        <Table.Tr key={item.enNo}>
          <Table.Td>{index + 1}</Table.Td>
          <Table.Td>
            <Group gap="sm">
              <Text size="sm" fw={500}>
                {item.enNo}
              </Text>
            </Group>
          </Table.Td>
          <Table.Td>{item.name}</Table.Td>
          <Table.Td>{item.sem}</Table.Td>
          <Table.Td>{item.div}</Table.Td>
          <Table.Td>
            {
              <IconTrash
                color="red"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  removeStudent(item.enNo, index);
                }}
              />
            }
          </Table.Td>
        </Table.Tr>
      );
    });
  return (
    <div>
      <Flex direction="column">
        <Center>
          <TextInput
            maw={400}
            radius="xl"
            size="md"
            placeholder="Search student"
            rightSectionWidth={42}
            value={searchvalue}
            leftSection={<IconSearch size={18} stroke={1.5} />}
            onInput={getsearchvalue}
            rightSection={
              <ActionIcon
                onClick={getsearchvalue}
                size={32}
                radius="xl"
                color={theme.primaryColor}
                variant="filled"
              >
                <IconArrowRight size={18} stroke={1.5} />
              </ActionIcon>
            }
          />
        </Center>
        <Text c={"dimmed"}>Add Student</Text>
        {searchresult.length <= 0 ? (
          <Center>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
              No Data Found
            </Text>
          </Center>
        ) : (
          <ScrollArea>
            <Paper style={{ margin: 10 }} shadow="sm" radius="lg" p="md">
              <Table
                miw={800}
                withTableBorder
                highlightOnHover
                verticalSpacing="sm"
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>SR</Table.Th>
                    <Table.Th>Enrollment No</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Sem</Table.Th>
                    <Table.Th>Div</Table.Th>
                    <Table.Th>Add</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Paper>
          </ScrollArea>
        )}

        <Text c={"dimmed"}>Current Students</Text>

        {studentdata.length <= 0 ? (
          <Center>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
              No Data Found
            </Text>
          </Center>
        ) : (
          <ScrollArea>
            <Paper style={{ margin: 10 }} shadow="sm" radius="lg" p="md">
              <Table
                miw={800}
                withTableBorder
                highlightOnHover
                verticalSpacing="sm"
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>SR</Table.Th>
                    <Table.Th>Enrollment No</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Sem</Table.Th>
                    <Table.Th>Div</Table.Th>
                    <Table.Th>Add</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{studentsrows}</Table.Tbody>
              </Table>
            </Paper>
          </ScrollArea>
        )}
      </Flex>
      {alertbox}
    </div>
  );
};

export default ManageStudent;
