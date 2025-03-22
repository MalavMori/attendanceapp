"use client";
import AlertError from "@/app/components/AlertError";
import AlertLoading from "@/app/components/AlertLoading";
import AlertSuccess from "@/app/components/AlertSuccess";
import {
  Button,
  Center,
  Flex,
  Modal,
  MultiSelect,
  Paper,
  PinInput,
  ScrollArea,
  Select,
  Switch,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const OTPPage = ({ params }) => {
  const [studentsdata, setstudentsdata] = useState([]);
  const [registerdata, setRegisterdata] = useState({});
  const [classtype, setClasstype] = useState("");
  const [isGPSchecked, setIsGPSchecked] = useState(false);
  const [pin, setPin] = useState("");
  const [isstarted, setIsstarted] = useState(false);
  const [alertbox, setAlertbox] = useState("");
  const [tempAttId, setTempAttId] = useState("");
  const [presentdata, setPresentdata] = useState([]);
  const [addstudents, setAddstudents] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [setstoptakingatt, setSetstoptakingatt] = useState(true);
  const router = useRouter()
  const getstudentdetail = async () => {
    setAlertbox(<AlertLoading />);
    const res = await fetch(
      "/api/attendance/getstudents",
      {
        method: "POST",
        body: JSON.stringify({
          registerid: (await params).registerid,
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
  const senddata = async () => {
    if (classtype) {
      function generateRandomNumber() {
        return Math.floor(1000 + Math.random() * 9000);
      }
      const randomNumber = generateRandomNumber();
      setPin(randomNumber.toString());
      setAlertbox(<AlertLoading />);
      const res = await fetch(
        "/api/attendance/tempattdance",
        {
          method: "POST",
          body: JSON.stringify({
            registerdata,
            gps: isGPSchecked,
            classtype,
            key: randomNumber.toString(),
            date: DateTime.now().toFormat("yyyy/MM/dd"),
            atttype: "OTP",
          }),
        }
      );
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
        setTempAttId(data.payload);
        setIsstarted(true);
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
    } else {
      setAlertbox(
        <AlertError
          title={"Error"}
          close={() => {
            setAlertbox("");
          }}
          message={"Select class type"}
        />
      );
    }
  };
  const syncdata = async () => {
    if (tempAttId) {
      setAlertbox(<AlertLoading />);
      const res = await fetch(
        "/api/attendance/tempattdance/getpresentdata",
        {
          method: "POST",
          body: JSON.stringify({
            tempAttId,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setPresentdata(data.payload.present);
        setAlertbox("");
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
    } else {
      setAlertbox(
        <AlertError
          title={"Error"}
          close={() => {
            setAlertbox("");
          }}
          message={"Attendance Id Not Found"}
        />
      );
    }
  };
  useEffect(() => {
    getstudentdetail();
  }, []);
  return (
    <>
      <Flex
        justify="center"
        wrap={"wrap"}
        direction={"column"}
        align={"center"}
      >
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
          <Switch
            onChange={(e) => {
              setIsGPSchecked(e.target.checked);
            }}
            labelPosition="left"
            style={{ marginTop: "10px" }}
            label="GPS"
            onLabel="ON"
            offLabel="OFF"
          />
        </Paper>
        <Paper shadow="sm" radius="lg" p="md">
          {isstarted ? (
            <>
              <PinInput value={pin} readOnly inputType="number" length={4} />
              {setstoptakingatt ? (
                <Button
                  style={{ marginTop: "10px" }}
                  onClick={async () => {
                    setAlertbox(<AlertLoading />);
                    const res = await fetch(
                      "/api/attendance/tempattdance/startstopatt",
                      {
                        method: "POST",
                        body: JSON.stringify({
                          isworking: false,
                          tempAttId,
                        }),
                      }
                    );
                    const data = await res.json();
                    if (data.success) {
                      setAlertbox(
                        <AlertSuccess
                          title={"Done"}
                          close={() => {
                            setAlertbox("");
                          }}
                          message={"Stoped"}
                        />
                      );
                      setSetstoptakingatt(false);
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
                  }}
                >
                  Stop Taking Attendance
                </Button>
              ) : (
                <Button
                  style={{ marginTop: "10px" }}
                  onClick={async () => {
                    setAlertbox(<AlertLoading />);
                    const res = await fetch(
                      "/api/attendance/tempattdance/startstopatt",
                      {
                        method: "POST",
                        body: JSON.stringify({
                          isworking: true,
                          tempAttId,
                        }),
                      }
                    );
                    const data = await res.json();
                    if (data.success) {
                      setAlertbox(
                        <AlertSuccess
                          title={"Done"}
                          close={() => {
                            setAlertbox("");
                          }}
                          message={"Started"}
                        />
                      );
                      setSetstoptakingatt(true);
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
                  }}
                >
                  Start Taking Attendance
                </Button>
              )}
            </>
          ) : (
            <Button onClick={senddata}>Start</Button>
          )}
        </Paper>
      </Flex>
      {isstarted ? (
        <div>
          <Center>
            <ScrollArea>
              <Paper style={{ margin: "10px" }} shadow="sm" radius="lg" p="md">
                <Button
                  variant="default"
                  onClick={syncdata}
                  leftSection={<IconRefresh color="green" />}
                >
                  Sync Data
                </Button>
                <Table
                  highlightOnHover
                  horizontalSpacing="md"
                  miw={400}
                  verticalSpacing="xs"
                  layout="auto"
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>SR</Table.Th>
                      <Table.Th>Enrollment No</Table.Th>
                      <Table.Th>Name</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {studentsdata
                      .filter((student) => {
                        return presentdata.includes(student.enNo);
                      })
                      .map((present, index) => {
                        return (
                          <Table.Tr key={present.enNo}>
                            <Table.Th>
                              <Text>{index + 1}</Text>
                            </Table.Th>
                            <Table.Th>
                              <Text>{present.enNo}</Text>
                            </Table.Th>
                            <Table.Th>
                              <Text>{present.name}</Text>
                            </Table.Th>
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>

                {presentdata.length == 0 ? <Text>No data Found</Text> : ""}
              </Paper>
            </ScrollArea>
          </Center>
          <Center>
            <ScrollArea>
              <Paper style={{ margin: "10px" }} shadow="sm" radius="lg" p="md">
                <Button
                  variant="default"
                  onClick={open}
                  leftSection={<IconPlus color="green" />}
                >
                  Add
                </Button>
                <Modal opened={opened} onClose={close} title="Authentication">
                  <MultiSelect
                    label="Your favorite libraries"
                    placeholder="Pick value"
                    onChange={(e) => {
                      setAddstudents(e);
                    }}
                    value={addstudents}
                    data={studentsdata
                      .filter((student) => !presentdata.includes(student.enNo))
                      .map((student) => {
                        return student.enNo.toString();
                      })}
                  />
                </Modal>
                <Table
                  highlightOnHover
                  horizontalSpacing="md"
                  miw={400}
                  verticalSpacing="xs"
                  layout="auto"
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>SR</Table.Th>
                      <Table.Th>Enrollment No</Table.Th>
                      <Table.Th>Name</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {studentsdata
                      .filter((students) => {
                        return addstudents.includes(students.enNo.toString());
                      })
                      .map((addedstudent, index) => {
                        return (
                          <Table.Tr key={addedstudent.enNo}>
                            <Table.Th>
                              <Text>{index + 1}</Text>
                            </Table.Th>
                            <Table.Th>
                              <Text>{addedstudent.enNo}</Text>
                            </Table.Th>
                            <Table.Th>
                              <Text>{addedstudent.name}</Text>
                            </Table.Th>
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>
                {addstudents.length == 0 ? <Text>No data Found</Text> : ""}
              </Paper>
            </ScrollArea>
          </Center>
          <Center>
            <Button
              onClick={async () => {
                setAlertbox(<AlertLoading />);
                const res = await fetch(
                  "/api/attendance/tempattdance/saveattendance",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      students: [
                        ...new Set([
                          ...presentdata,
                          ...addstudents.map((student) =>
                            Number.parseInt(student)
                          ),
                        ]),
                      ],
                      tempAttId,
                    }),
                  }
                );
                const data = await res.json();
                if (data.success) {
                  setAlertbox(
                    <AlertSuccess
                      title={"Done"}
                      close={() => {
                        setAlertbox("");
                      }}
                      message={"Started"}
                    />
                  );
                  router.push("/register")
                  
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
              }}
            >
              Submit
            </Button>
          </Center>
        </div>
      ) : (
        ""
      )}
      {alertbox}
    </>
  );
};

export default OTPPage;
