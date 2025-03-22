"use client"
import { Notification } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React,{useEffect} from "react";

const AlertError = ({ title, message, close }) => {
  const xIcon = <IconX size={20} />;
  useEffect(() => {
    setTimeout(() => {
      close();
    }, 2000);
  }, []);
  return (
    <Notification
      pos={"fixed"}
      style={{
        right: 0,
        bottom: 0,
        margin: 20,
        zIndex: 1000,
      }}
      icon={xIcon}
      color="red"
      onClose={close}
      title={title}
    >
      {message}
    </Notification>
  );
};

export default AlertError;
