"use client";
import React, { useState } from "react";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import {
  Avatar,
  Group,
  Text,
  TextInput,
  ActionIcon,
  useMantineTheme,
  Divider,
  Table,
  ScrollArea,
  Center,
  Paper,
} from "@mantine/core";
import StudentForm from "./StudentForm";
import StudentAddSheet from "./StudentAddSheet";
import AlertLoading from "../components/AlertLoading";
import useStore from "@/store";

const Student = () => {
  const theme = useMantineTheme();
  const [searchresult, setSearchresult] = useState([]);
  const [showresult, setShowresult] = useState("none");
  const [searchvalue, setSearchvalue] = useState("");
  const [alertbox, setAlertbox] = useState("");
  const user = useStore((state) => state.user);
  const userprofile = useStore((state) => state.userprofile);

  const getsearchvalue = (e) => {
    if (e.type != "click") {
      setSearchvalue(e.target.value);
      console.log(e.target.value)
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
          setSearchresult(result);
          setAlertbox("");
          setShowresult("");
        })
        .catch((err) => {});
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
        <Table.Td>{item.email}</Table.Td>
        <Table.Td>{item.phoneNo}</Table.Td>
        <Table.Td>{item.sem}</Table.Td>
        <Table.Td>{item.div}</Table.Td>
      </Table.Tr>
    );
  });
  return (
    <>
      <div style={{ padding: 10, width: "100%" }}>
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
        <div
          style={{
            display: showresult,
            margin: "10px 0",
            width: "100%",
            justifyContent: "center",
          }}
          className="flex flex-wrap justify-items-center w-full rounded-md"
        >
          {searchresult.length <= 0 ? (
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
              No Data Found
            </Text>
          ) : (
            <ScrollArea >
                <Paper style={{margin:10}} shadow="sm" radius="lg" p="xl">
                <Table  miw={800} withTableBorder verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>SR</Table.Th>
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
            </Paper>
              </ScrollArea>
          )}
        </div>
        <Divider my="md" />
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          Add Student
        </Text>
        <div className="flex flex-wrap justify-center">
          <StudentForm />
          <StudentAddSheet />
        </div>
        {alertbox}
      </div>
    </>
  );
};

export default Student;
