"use client";
import {
  Button,
  Center,
  Paper,
  ScrollArea,
  Select,
  Table,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import AlertSuccess from "../components/AlertSuccess";
import AlertError from "../components/AlertError";
import AlertLoading from "../components/AlertLoading";

const SaveBssid = () => {
  const [websocket, setWebsocket] = useState(null);
  const [className, setClassName] = useState("");
  const [scandata, setScandata] = useState([]);
  const [studentsdata, setStudentsdata] = useState([]);
  const [alertbox, setAlertbox] = useState("");

  const setWSdata = (data) => {
    try {
      const scanwifidata = JSON.parse(data.data);
      console.log(className);
      if (scanwifidata.CLASS == className) {
        setAlertbox("");
        const scandataarr = [];
        scanwifidata.WIFIRESULT.forEach((data) => {
          const device = data.split("[AND]");
          scandataarr.push({
            ssid: device[0].trim(),
            bssid: device[1],
          });
        });
        setScandata(scandataarr);
        console.log(scandataarr);
      }
    } catch (error) {}
  };

  const findStudents = async () => {
    const studentsEnNoarr = [];
    scandata.forEach((student) => {
      try {
        const enNo = Number.parseInt(student.ssid);
        if (!enNo) {
          throw Error("Error");
        }
        studentsEnNoarr.push(enNo);
      } catch (error) {}
    });
    if (studentsEnNoarr.length > 0) {
      setAlertbox(<AlertLoading />);
      const res = await fetch("/api/student/getstudentbyenno", {
        method: "POST",
        body: JSON.stringify({
          studentsEnNoarr,
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

  const removeStudent = (studentIndex) => {
    const newarr = [...studentsdata];
    newarr.splice(studentIndex, 1);
    setStudentsdata(newarr);
  };

  const updateOneStudent = async (enNo) => {
    const student = studentsdata.find((student) => student.enNo == enNo);
    if (student) {
      setAlertbox(<AlertLoading />);
      const bssid = scandata.find((data) => data.ssid == enNo.toString()).bssid;
      const res = await fetch("/api/student/updatebssid", {
        method: "POST",
        body: JSON.stringify({
          data: { enNo, bssid },
          type: "ONE",
        }),
      });
      const data = await res.json();
      console.log(data);
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
        const studentindex = studentsdata.findIndex(
          (student) => student.enNo == enNo
        );
        const newarr = [...studentsdata];
        newarr.splice(studentindex, 1);
        setStudentsdata(newarr);
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

  const updateAllStudent = async () => {
    if (scandata.length > 0 && studentsdata.length > 0) {
      const senddata = studentsdata.map((data) => {
        return {
          enNo: data.enNo,
          bssid: scandata.find((scan) => scan.ssid == data.enNo.toString())
            .bssid,
        };
      });
      setAlertbox(<AlertLoading />);

      const res = await fetch("/api/student/updatebssid", {
        method: "POST",
        body: JSON.stringify({ data: senddata, type: "MANY" }),
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
        const newarr = [];
        setStudentsdata(newarr);
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

  const rows = studentsdata.map((item, index) => {
    return (
      <Table.Tr key={item.enNo}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>
          <Text size="sm" fw={500}>
            {item.enNo}
          </Text>
        </Table.Td>
        <Table.Td>{item.name}</Table.Td>
        <Table.Td>
          {scandata.find((data) => data.ssid == item.enNo.toString()).bssid}
        </Table.Td>
        <Table.Td>{item.sem}</Table.Td>
        <Table.Td>{item.div}</Table.Td>
        <Table.Td>{item.email}</Table.Td>
        <Table.Td>{item.phoneNo}</Table.Td>
        <Table.Td>
          <Center>
            <UnstyledButton
              onClick={() => {
                updateOneStudent(item.enNo);
              }}
            >
              <IconEdit
                color="green"
                style={{ cursor: "pointer", marginRight: "20px" }}
                size={20}
              />
            </UnstyledButton>
            <UnstyledButton
              onClick={() => {
                removeStudent(index);
              }}
            >
              <IconTrash color="red" style={{ cursor: "pointer" }} size={20} />
            </UnstyledButton>
          </Center>
        </Table.Td>
      </Table.Tr>
    );
  });

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    setWebsocket(ws);
    return () => {
      ws.close();
    };
  }, []);
  return (
    <div style={{ padding: "10px" }}>
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
      <ScrollArea>
        <Paper style={{ margin: 10 }} shadow="sm" radius="lg" p="md">
          <Table withTableBorder verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>SR</Table.Th>
                <Table.Th>SSID</Table.Th>
                <Table.Th>BSSID</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {scandata.map((data, index) => {
                return (
                  <Table.Tr key={data.bssid}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>{data.ssid}</Table.Td>
                    <Table.Td>{data.bssid}</Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Paper>
      </ScrollArea>
      <Center style={{ marginTop: "10px" }}>
        {scandata.length > 0 && (
          <Button onClick={findStudents}>Find Students</Button>
        )}
      </Center>
      {studentsdata.length > 0 && (
        <ScrollArea>
          <Paper style={{ margin: 10 }} shadow="sm" radius="lg" p="md">
            <Table miw={900} withTableBorder verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>SR</Table.Th>
                  <Table.Th>Enrollment No</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>BSSID</Table.Th>
                  <Table.Th>Sem</Table.Th>
                  <Table.Th>Div</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Phone No</Table.Th>
                  <Table.Th>Edit/Remove</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Paper>
        </ScrollArea>
      )}
      <Center style={{ marginTop: "10px" }}>
        {studentsdata.length > 0 && (
          <Button onClick={updateAllStudent}>Update All</Button>
        )}
      </Center>
      {alertbox}
    </div>
  );
};

export default SaveBssid;
