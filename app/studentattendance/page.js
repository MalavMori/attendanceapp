"use client";
import {
  Button,
  Center,
  Flex,
  Modal,
  Paper,
  PinInput,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import AlertLoading from "../components/AlertLoading";
import AlertSuccess from "../components/AlertSuccess";
import AlertError from "../components/AlertError";
import { Html5Qrcode } from "html5-qrcode";
import { DateTime } from "luxon";
import { useDisclosure } from "@mantine/hooks";

const StudentaAttendance = () => {
  const [tempAttData, setTempAttData] = useState([]);
  const [keyobj, setKeyobj] = useState({});
  const [alertbox, setAlertbox] = useState("");
  const [qrCodeScanner, setQrCodeScanner] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [scandiv, setScandiv] = useState("none");
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
  const startScanner = async (data) => {
    const { id, isgps } = data;
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        const cameraId = devices[0].id;
        qrCodeScanner.start(
          cameraId,
          {
            fps: 5, // Frames per second
            qrbox: 300, // Define scanning box width and height
          },
          (decodedText) => {
            setScandiv("none");
            keyobj[id] = decodedText;
            setKeyobj(keyobj);
            submit({ id, isgps });
            qrCodeScanner
              .stop()
              .then((s) => {
              })
              .catch((e) => {
                setScandiv("none");
              });
          },
          (errorMessage) => {
            console.warn(`QR Code scan failed: ${errorMessage}`);
          }
        );
      } else {
        console.error("No cameras found.");
        setScandiv("none");
      }
    } catch (error) {
      console.error("Error initializing QR code scanner: ", error);
      setScandiv("none");
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
              const res = await fetch(
                "/api/studenttempatt/takeattendance",
                {
                  method: "POST",
                  body: JSON.stringify({
                    key: keyobj[id],
                    tempattid: id,
                    coords: { lat, lng },
                  }),
                }
              );
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
        const res = await fetch(
          "/api/studenttempatt/takeattendance",
          {
            method: "POST",
            body: JSON.stringify({
              key: keyobj[id],
              tempattid: id,
            }),
          }
        );
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
    setQrCodeScanner(new Html5Qrcode("reader"));
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
                      startScanner({
                        id: tempatt._id,
                        isgps: tempatt.isgps,
                      });
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
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 100,
        }}
      >
        <div
          id="reader"
          style={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            height: "300px",
            zIndex: 1000,
          }}
        ></div>
        <Button
          style={{ position: "absolute", right: 0, bottom: 0, margin: "20px" }}
          onClick={() => {
            setScandiv("none");
            qrCodeScanner
              .stop()
              .then((s) => {
              })
              .catch((e) => {
                setScandiv("none");
              });
          }}
        >
          Stop
        </Button>
      </div>
      {tempAttData.length == 0 && <Center c={"dimmed"} h={200}>No Record Found</Center>}
      {alertbox}
    </>
  );
};

export default StudentaAttendance;
