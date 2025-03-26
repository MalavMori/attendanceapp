"use client";
import {
  Button,
  Center,
  Flex,
  Paper,
  PinInput,
  Text,
  Box,
  Group,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import AlertLoading from "../components/AlertLoading";
import AlertSuccess from "../components/AlertSuccess";
import AlertError from "../components/AlertError";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { DateTime } from "luxon";

const StudentaAttendance = () => {
  const [tempAttData, setTempAttData] = useState([]);
  const [keyobj, setKeyobj] = useState({});
  const [alertbox, setAlertbox] = useState("");
  const [qrCodeScanner, setQrCodeScanner] = useState(null);
  const [scandiv, setScandiv] = useState("none");
  const [currentattobj, setCurrentattobj] = useState({ id: "", isgps: false });

  const getTempAttData = async () => {
    setAlertbox(<AlertLoading />);
    const res = await fetch("/api/studenttempatt", {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      setTempAttData(data.payload);
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

  const submit = async (data) => {
    const { id, isgps } = data;
    if (keyobj[id]?.length >= 4) {
      if (isgps) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const res = await fetch("/api/studenttempatt/takeattendance", {
                method: "POST",
                body: JSON.stringify({
                  key: keyobj[id],
                  tempattid: id,
                  coords: { lat, lng },
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
            },
            (error) => {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  console.error("User denied the request for Geolocation.");
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.error("Location information is unavailable.");
                  break;
                case error.TIMEOUT:
                  console.error("The request to get user location timed out.");
                  break;
                case error.UNKNOWN_ERROR:
                  console.error("An unknown error occurred.");
                  break;
              }
            },
            {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 5000,
            }
          );
        } else {
        }
      } else {
        const res = await fetch("/api/studenttempatt/takeattendance", {
          method: "POST",
          body: JSON.stringify({
            key: keyobj[id],
            tempattid: id,
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
      }
    }
  };

  useEffect(() => {
    getTempAttData();
    const initializeScanner = async () => {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 5,
        qrbox: { width: 300, height: 300 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      });
      setQrCodeScanner(scanner);
    };

    initializeScanner();
    return () => {
      if (qrCodeScanner) {
        qrCodeScanner.clear().then((error) => {});
      }
    };
  }, []);
  return (
    <>
      <Flex
        justify="center"
        align="center"
        direction="column"
        gap={"md"}
        style={{ margin: "10px" }}
      >
        {tempAttData.map((tempatt) => {
          return (
            <Paper key={tempatt._id} p={"md"} shadow="md" radius={"md"}>
              <Text>Subject: {tempatt.registerdata.subjectname}</Text>
              <Text>Code: {tempatt.registerdata.subjectcode}</Text>
              <Text>ClassType: {tempatt.classtype}</Text>
              <Text>
                Date: {DateTime.fromISO(tempatt.date).toFormat("dd/MM/yyyy")}
              </Text>
              {tempatt.atttype === "OTP" ? (
                <>
                  <PinInput
                    onChange={(e) => {
                      keyobj[tempatt._id] = e;
                      setKeyobj(keyobj);
                    }}
                    inputType="number"
                    length={4}
                  />
                  <Center style={{ marginTop: "10px" }}>
                    <Button
                      onClick={() => {
                        submit({
                          id: tempatt._id,
                          isgps: tempatt.isgps,
                        });
                      }}
                    >
                      Submit
                    </Button>
                  </Center>
                </>
              ) : (
                <Center style={{ marginTop: "10px" }}>
                  <Button
                    onClick={() => {
                      setScandiv("grid");
                      setCurrentattobj({
                        id: tempatt._id,
                        isgps: tempatt.isgps,
                      });
                      qrCodeScanner.render(
                        (data) => {
                          qrCodeScanner.clear().then(() => {
                            setScandiv("none");
                            keyobj[tempatt._id] = data;
                            setKeyobj(keyobj);
                            submit({
                              id: tempatt._id,
                              isgps: tempatt.isgps,
                            });
                            console.log({
                              id: tempatt._id,
                              isgps: tempatt.isgps,
                            });
                          });
                        },
                        (e) => {}
                      );
                    }}
                  >
                    Scan QR
                  </Button>
                </Center>
              )}
            </Paper>
          );
        })}
      </Flex>

      <div
        style={{
          display: scandiv,
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          padding: "10px",
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 100,
        }}
      >
        <Center>
          <Box
            style={{
              zIndex: 1000,
            }}
          >
            <div id="reader"></div>
            <Group justify="flex-end">
              <Button
                onClick={() => {
                  qrCodeScanner.clear().then(() => {
                    setScandiv("none");
                  });
                }}
              >
                Stop
              </Button>
            </Group>
          </Box>
        </Center>
      </div>
      {tempAttData.length == 0 && (
        <Center c={"dimmed"} h={200}>
          No Record Found
        </Center>
      )}
      {alertbox}
    </>
  );
};

export default StudentaAttendance;
