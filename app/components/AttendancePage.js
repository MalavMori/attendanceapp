"use client";
import {
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Paper,
  Progress,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconPlus, IconRefresh, IconSwimming } from "@tabler/icons-react";
import React, { useState } from "react";
import AlertLoading from "./AlertLoading";
import AlertError from "./AlertError";
import classes from "./StatsCard.module.css";
import { DateTime } from "luxon";

function AttendanceCard({
  subjectName,
  subjectCode,
  labAttendance,
  lecAttendance,
}) {
  return (
    <Card
      shadow="xl"
      padding="lg"
      radius="lg"
      style={{
        maxWidth: "300px",
        margin: "auto",
        textAlign: "center",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Subject Details */}
      <Text weight={700} size="xl" style={{ color: "#2E3A59" }}>
        {subjectName}
      </Text>
      <Text size="sm" color="dimmed" style={{ marginBottom: "20px" }}>
        Code: {subjectCode}
      </Text>

      <Divider my="sm" />

      {/* Lab Attendance */}
      <Group position="center" style={{ marginBottom: "20px" }}>
        <RingProgress
          size={100}
          thickness={8}
          roundCaps
          sections={[{ value: labAttendance, color: "blue" }]}
          label={
            <Text weight={700} align="center" size="sm">
              {labAttendance}%
            </Text>
          }
        />
        <Stack spacing="xs" style={{ marginLeft: "20px", textAlign: "left" }}>
          <Text weight={500}>Lab</Text>
        </Stack>
      </Group>

      {/* Lecture Attendance */}
      <Group position="center" style={{ marginBottom: "20px" }}>
        <RingProgress
          size={100}
          thickness={8}
          roundCaps
          sections={[{ value: lecAttendance, color: "green" }]}
          label={
            <Text weight={700} align="center" size="sm">
              {lecAttendance}%
            </Text>
          }
        />
        <Stack spacing="xs" style={{ marginLeft: "20px", textAlign: "left" }}>
          <Text weight={500}>Lecture</Text>
        </Stack>
      </Group>
    </Card>
  );
}

const AttendancePage = () => {
  const [registerdata, setRegisterdata] = useState([]);
  const [attendancedata, setAttendancedata] = useState([]);
  const [alertbox, setAlertbox] = useState("");
  const [isdatasync, setIsdatasync] = useState(false);

  const calculateAttendance = ({
    fromdate,
    todate,
    workingDays,
    nonworkingDates,
    classtype,
    registerid,
  }) => {
    let currentdate = DateTime.fromISO(fromdate.toISOString());
    let toenddate = DateTime.fromISO(todate.toISOString());
    const workingdates = [];
    while (currentdate.toMillis() <= toenddate.toMillis()) {
      if (
        workingDays.includes(currentdate.weekdayShort) &&
        !nonworkingDates.includes(currentdate.toFormat("dd/MM/yyyy"))
      ) {
        workingdates.push(currentdate.toFormat("dd/MM/yyyy"));
      }
      currentdate = currentdate.plus({ days: 1 });
    }
    const presents = attendancedata.filter((attendance) => {
      return (
        workingdates.includes(
          DateTime.fromISO(attendance.date).toFormat("dd/MM/yyyy")
        ) &&
        attendance.classtype == classtype &&
        attendance.registerid == registerid
      );
    });
    return ((presents.length * 100) / workingdates.length).toFixed(2);
  };

  const getattendancedata = async () => {
    setAlertbox(<AlertLoading />);
    const res = await fetch("/api/attendance/getattdata", {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      setAttendancedata(data.payload.attendance);
      setRegisterdata(data.payload.register);
      setAlertbox("");
      setIsdatasync(true);
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
  return (
    <>
      {!isdatasync && (
        <Button
          variant="outline"
          onClick={getattendancedata}
          leftSection={<IconRefresh color="green" />}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            color: "ActiveBorder",
          }}
        >
          Sync Data
        </Button>
      )}
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
        style={{
          margin: "10px",
        }}
      >
        {registerdata.map((register) => {
          const todate =
            new Date().getTime() < new Date(register.enddate).getTime()
              ? new Date()
              : new Date(register.enddate);
          let lecpercentage = calculateAttendance({
            fromdate: new Date(register.startdate),
            todate: todate,
            workingDays: register.workingDaysLec,
            nonworkingDates: register.nonworkingdateLec.map((date) => {
              return new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            }),
            classtype: "Lec",
            registerid: register._id,
          });
          let labpercentage = calculateAttendance({
            fromdate: new Date(register.startdate),
            todate: todate,
            workingDays: register.workingDaysLab,
            nonworkingDates: register.nonworkingdateLab.map((date) => {
              return new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            }),
            classtype: "Lab",
            registerid: register._id,
          });
          return (
            <div key={register._id}>
              <AttendanceCard
                subjectCode={register.subjectcode}
                labAttendance={labpercentage}
                lecAttendance={lecpercentage}
                subjectName={register.subjectname}
              />
            </div>
          );
        })}
      </Flex>
      {alertbox}
    </>
  );
};

export default AttendancePage;
