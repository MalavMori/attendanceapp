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
  ScrollArea,
  Select,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BssidPage = ({ params }) => {
  const [studentsdata, setstudentsdata] = useState([]);
  const [registerdata, setRegisterdata] = useState({});
  const [className, setClassName] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [classtype, setClasstype] = useState("");
  const [alertbox, setAlertbox] = useState("");
  const [isstarted, setIsstarted] = useState(false);
  const [presentdata, setPresentdata] = useState([]);
  const [addstudents, setAddstudents] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);

  const [scandata, setScandata] = useState([]);
  const router = useRouter();

  const setWSdata = (data) => {
    try {
      const scanwifidata = JSON.parse(data.data);
      console.log(className);
      if (scanwifidata.CLASS == className) {
        setAlertbox("");
        const scandataarr = [];
        const presentstudents = [];
        scanwifidata.WIFIRESULT.forEach((data) => {
          const device = data.split("[AND]");
          try {
            const enNo = Number.parseInt(device[0].trim());
            if (!enNo) {
              throw Error("Error");
            }
            scandataarr.push({
              ssid: enNo,
              bssid: device[1],
            });
            if (
              studentsdata.find(
                (student) => student.enNo == enNo && student.bssid == device[1]
              )
            ) {
              presentstudents.push(enNo);
            }
          } catch (error) {}
        });
        setScandata(scandataarr);
        setPresentdata(presentstudents);
      }
    } catch (error) {}
  };

  const getstudentdetail = async () => {
    setAlertbox(<AlertLoading />);
    const res = await fetch("/api/attendance/getstudents", {
      method: "POST",
      body: JSON.stringify({
        registerid: (await params).registerid,
      }),
    });
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

  useEffect(() => {
    getstudentdetail();
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    setWebsocket(ws);
    return () => {
      ws.close();
    };
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
        </Paper>
        <Select
          label="Select Class"
          placeholder="Pick Class"
          onChange={(value) => setClassName(value)}
          data={["CLASS1"]}
        />
        <Center style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              if (className) {
                setAlertbox(<AlertLoading />);
                websocket.send(className);
                websocket.onmessage = (data) => {
                  setWSdata(data);
                };
              }
            }}
            variant="outline"
          >
            Scan
          </Button>
        </Center>
        <div>
          <Center>
            <ScrollArea>
              <Paper style={{ margin: "10px" }} shadow="sm" radius="lg" p="md">
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
                const res = await fetch("/api/attendance/manual", {
                  method: "POST",
                  body: JSON.stringify({
                    date: DateTime.now().toFormat("yyyy/MM/dd"),
                    registerid: registerdata._id,
                    classtype: classtype,
                    students: [
                      ...new Set([
                        ...presentdata,
                        ...addstudents.map((student) =>
                          Number.parseInt(student)
                        ),
                      ]),
                    ],
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
                      message={"Started"}
                    />
                  );
                  router.push("/register");
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
      </Flex>
      {alertbox}
    </>
  );
};

export default BssidPage;
