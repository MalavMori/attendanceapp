"use client";
import React from "react";
import {
  IconCheckupList,
  IconPassword,
  IconQrcode,
  IconWifi,
} from "@tabler/icons-react";
import { Menu, useMantineTheme, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

const AttMenu = ({ target, registerid }) => {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <>
      <Menu
        transitionProps={{ transition: "pop-top-right" }}
        position="top-end"
        width={220}
        withinPortal
      >
        <Menu.Target>{target}</Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>
            <Text fz={13}>Attendence</Text>
          </Menu.Label>
          <Menu.Item
            onClick={() => {
              router.push(`/attendance/manual/${registerid}`);
            }}
            leftSection={
              <IconCheckupList
                size={16}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            }
          >
            Manual
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconWifi size={16} color={theme.colors.pink[6]} stroke={1.5} />
            }
          >
            BSSID
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              router.push(`/attendance/otp/${registerid}`);
            }}
            leftSection={
              <IconPassword
                size={16}
                color={theme.colors.cyan[6]}
                stroke={1.5}
              />
            }
          >
            OTP
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              router.push(`/attendance/qr/${registerid}`);
            }}
            leftSection={
              <IconQrcode
                size={16}
                color={theme.colors.violet[6]}
                stroke={1.5}
              />
            }
          >
            QR
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default AttMenu;
