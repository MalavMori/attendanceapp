"use client";
import useStore from "@/store";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import AlertLoading from "./AlertLoading";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";
import { IconCheck } from "@tabler/icons-react";

export function UserProfileCard({
  enNo,
  name,
  email,
  phoneNo,
  department,
  profile_img,
  sem,
  div,
  bssid,
  usertype,
  self,
  isauthenticated,
}) {
  const [opened, setOpened] = useState(false);
  const [facultyDetail, setFacultyDetail] = useState([]);
  const [alertbox, setAlertbox] = useState("");

  const getFacultydetail = async () => {
    if (facultyDetail.length == 0) {
      setAlertbox(<AlertLoading />);

      const res = await fetch("/api/getfacultyinfo", {
        method: "POST",
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
        setFacultyDetail(data.payload);
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
    }
  };
  const sendAuthRequest = async ({ facultyid }) => {
    setAlertbox(<AlertLoading />);

    const res = await fetch(
      "/api/authrequest/sendauthrequest",
      {
        method: "POST",
        body: JSON.stringify({
          facultyid,
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
      setOpened(false);
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
    <div style={{ position: "relative", margin: "auto", maxWidth: "400px" }}>
      {/* Floating Avatar */}
      <Avatar
        src={profile_img}
        alt={name}
        size={100}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          border: "4px solid #ffffff",
          borderRadius: "50%",
          zIndex: 2, // Ensures it stays on top
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* Card */}
      <Card
        shadow="xl"
        padding="lg"
        radius="lg"
        style={{
          marginTop: "50px", // Push the card content below the avatar
          textAlign: "center",
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Name and Basic Info */}
        <Text
          weight={700}
          size="xl"
          style={{ marginTop: "40px", color: "#2E3A59" }}
        >
          {name}
        </Text>
        <Text size="sm" color="dimmed" style={{ marginBottom: "8px" }}>
          {email}
        </Text>

        {/* Divider */}
        <Divider my="sm" />

        {/* Additional Details */}
        <Stack spacing="xs" style={{ textAlign: "left", padding: "0 10px" }}>
          {enNo ? (
            <Group position="apart">
              <Text weight={500}>Enrollment No:</Text>
              <Text color="dimmed">{enNo}</Text>
            </Group>
          ) : (
            ""
          )}
          {phoneNo ? (
            <Group position="apart">
              <Text weight={500}>Phone No:</Text>
              <Text color="dimmed">{phoneNo}</Text>
            </Group>
          ) : (
            ""
          )}
          {department ? (
            <Group position="apart">
              <Text weight={500}>Department:</Text>
              <Text color="dimmed">{department}</Text>
            </Group>
          ) : (
            ""
          )}
          {sem ? (
            <Group position="apart">
              <Text weight={500}>Semester:</Text>
              <Text color="dimmed">{sem}</Text>
            </Group>
          ) : (
            ""
          )}
          {div ? (
            <Group position="apart">
              <Text weight={500}>Division:</Text>
              <Text color="dimmed">{div}</Text>
            </Group>
          ) : (
            ""
          )}
          {bssid ? (
            <Group position="apart">
              <Text weight={500}>BSSID:</Text>
              <Text c="dimmed">{bssid}</Text>
            </Group>
          ) : (
            ""
          )}
        </Stack>
        {self && usertype == "student" && (
          <>
            {isauthenticated ? (
              <>
                <Center style={{ marginTop: "10px" }}>
                  <Badge color="green" variant="light">
                    Verified
                  </Badge>
                </Center>
              </>
            ) : (
              <Stack spacing="xs" align="center">
                <Center style={{ marginTop: "10px" }}>
                  <Badge color="red" variant="light">
                    Unverified
                  </Badge>
                </Center>
                <Group position="center">
                  <Button
                    radius="md"
                    variant="outline"
                    onClick={() => {
                      setOpened(true);
                      getFacultydetail();
                    }}
                  >
                    Send Request
                  </Button>
                  <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="User Information"
                    centered
                    size="sm"
                    radius={"md"}
                    transition="fade"
                  >
                    {facultyDetail.map((facilty) => {
                      return (
                        <Card
                          key={facilty._id}
                          shadow="sm"
                          padding="lg"
                          radius="lg"
                          style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e0e0e0",
                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                            margin: "5px",
                          }}
                        >
                          <Group wrap="nowrap" style={{ marginBottom: "10px" }}>
                            <Avatar
                              src={facilty.profile_img}
                              alt={facilty.firstname + " " + facilty.lastname}
                              size={60}
                              radius="xl"
                              style={{
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                              }}
                            />
                            <div>
                              <Text
                                weight={600}
                                size="lg"
                                style={{ color: "#2E3A59" }}
                              >
                                {facilty.firstname} {facilty.lastname}
                              </Text>
                              <Text size="sm" color="dimmed">
                                {facilty.email}
                              </Text>
                            </div>
                          </Group>
                          <Divider />
                          <Button
                            radius="md"
                            size="xs"
                            variant="light"
                            onClick={() => {
                              sendAuthRequest({ facultyid: facilty._id });
                            }}
                            fullWidth
                            style={{
                              marginTop: "15px",
                            }}
                          >
                            Send Auth Request
                          </Button>
                        </Card>
                      );
                    })}
                  </Modal>
                </Group>
              </Stack>
            )}
          </>
        )}
      </Card>
      {alertbox}
    </div>
  );
}

const Profile = ({ self }) => {
  const userprofile = useStore((state) => state.userprofile);
  const [usertype, setUsertype] = useState("");
  useEffect(() => {
    setUsertype(localStorage.getItem("usertype"));
  }, []);
  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <UserProfileCard
          name={userprofile.firstname + " " + userprofile.lastname}
          {...userprofile}
          usertype={usertype}
          self={self}
          isauthenticated={userprofile.isauthenticated}
        />
      </div>
    </>
  );
};

export default Profile;
