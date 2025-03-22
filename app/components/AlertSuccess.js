import { Notification } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import React, { useEffect } from "react";

const AlertSuccess = ({title,message,close}) => {
  const checkIcon = <IconCheck  size={20} />;
  useEffect(()=>{
    setTimeout(() => {
      close()
    }, 2000);
  },[])
  return (
    <Notification 
    pos={"fixed"}
    onClose={close}
    style={{
        right: 0,
        bottom: 0,
        margin: 20,
        zIndex:1000
      }} color="teal" title={title} mt="md">
      {message}
    </Notification>
  );
};

export default AlertSuccess;
