"use client";
import { useState } from "react";
import { Burger, Container, Drawer, Avatar, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Group } from "@mantine/core";
import classes from "./HeaderSimple.module.css";
import Image from "next/image";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import useStore from "@/store";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const router = useRouter();
  const { user } = useStore();
  const [opened, { toggle, close }] = useDisclosure(false);
  return (
    <>
      <Drawer position="right" opened={opened} onClose={close} title="Menu">
        <Sidebar closeSideBar={close} />
      </Drawer>
      <header className={classes.header}>
        <Container size="md" className={classes.inner}>
          <div
            onClick={() => {
              router.push("/");
            }}
            className="flex items-center cursor-pointer"
          >
            <Image
              src={"/attendencelogo.png"}
              alt={"logo"}
              width={50}
              height={50}
            />
            <h2>Attendece</h2>
          </div>

          <Group gap={6}>
            <UserMenu
              target={<Avatar src={user?.user?.image} radius="xl" size="sm" />}
            />
            <Burger opened={opened} onClick={toggle} size="sm" />
          </Group>
        </Container>
      </header>
    </>
  );
};

export default TopBar;
