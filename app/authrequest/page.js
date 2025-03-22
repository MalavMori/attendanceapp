"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Avatar,
  Flex,
  Center,
} from "@mantine/core";
import AlertLoading from "../components/AlertLoading";
import AlertError from "../components/AlertError";
import AlertSuccess from "../components/AlertSuccess";

function StudentRequestCard({ student }) {
  const {
    enrollment,
    name,
    email,
    semester,
    division,
    image,
    onAccept,
    onReject,
  } = student;

  return (
    <Card shadow="md" m={10} p="lg" radius="md">
      <Group mb="md">
        <Avatar src={image} radius="xl" size="lg" alt={name} />
        <Text weight={600} size="xl">
          {name}
        </Text>
      </Group>

      <Stack spacing="xs">
        <Group position="apart">
          <Text weight={500}>Enrollment Number:</Text>
          <Text c="dimmed">{enrollment}</Text>
        </Group>
        <Group position="apart">
          <Text weight={500}>Email:</Text>
          <Text c="dimmed">{email}</Text>
        </Group>
        <Group position="apart">
          <Text weight={500}>Sem:</Text>
          <Text c="dimmed">{semester}</Text>
        </Group>
        <Group position="apart">
          <Text weight={500}>Div:</Text>
          <Text c="dimmed">{division}</Text>
        </Group>
      </Stack>
      <Flex justify={"space-between"}>
        <Button mt="lg" color="green" variant="filled" onClick={onAccept}>
          Accept Request
        </Button>
        <Button mt="lg" color="red" variant="filled" onClick={onReject}>
          Reject Request
        </Button>
      </Flex>
    </Card>
  );
}

const AuthRequest = () => {
  const [authrequestdata, setAuthrequestdata] = useState([]);
  const [studentsdata, setstudentsdata] = useState([]);
  const [alertbox, setAlertbox] = useState("");

  const onAccept = async ({ requestid }) => {
    setAlertbox(<AlertLoading />);

    const res = await fetch(
      "/api/authrequest/acceptrequest",
      {
        method: "POST",
        body: JSON.stringify({
          requestid,
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      authrequestdata.forEach((request, index) => {
        if (request._id == requestid) {
          authrequestdata.splice(index, 1);
          setAuthrequestdata(authrequestdata);
        }
      });
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
          close={() => {
            setAlertbox("");
          }}
          message={data.message}
        />
      );
    }
  };

  const onReject = async ({ requestid }) => {
    setAlertbox(<AlertLoading />);

    const res = await fetch(
      "/api/authrequest/rejectrequest",
      {
        method: "POST",
        body: JSON.stringify({
          requestid,
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      authrequestdata.forEach((request, index) => {
        if (request._id == requestid) {
          authrequestdata.splice(index, 1);
          setAuthrequestdata(authrequestdata);
        }
      });
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
          close={() => {
            setAlertbox("");
          }}
          message={data.message}
        />
      );
    }
  };

  const getAuthRequestData = async () => {
    setAlertbox(<AlertLoading />);

    const res = await fetch(
      "/api/authrequest/getauthrequest",
      {
        method: "POST",
      }
    );
    const data = await res.json();
    if (data.success) {
      setAuthrequestdata(data.payload.requestauth);
      setstudentsdata(data.payload.students);
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
          close={() => {
            setAlertbox("");
          }}
          message={data.message}
        />
      );
    }
  };

  useEffect(() => {
    getAuthRequestData();
  }, []);
  return (
    <div
      style={{
        margin: "10px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {authrequestdata.length == 0 && <Center c={"dimmed"} h={200}>No Record Found</Center>}
      {authrequestdata.map((request) => {
        const student = studentsdata.filter(
          (data) => data._id == request.studentid
        )[0];
        return (
          <StudentRequestCard
            key={request._id}
            student={{
              enrollment: student.enNo,
              name: student.name,
              email: student.email,
              semester: student.sem,
              division: student.div,
              image: student.profile_img,
              onAccept: () => {
                onAccept({ requestid: request._id });
              },
              onReject: () => {
                onReject({ requestid: request._id });
              },
            }}
          />
        );
      })}

      {alertbox}
    </div>
  );
};

export default AuthRequest;
