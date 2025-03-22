import { useEffect, useState } from "react";
import { IconChevronRight, IconUser } from "@tabler/icons-react";
import useStore from "@/store";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import classes from "./UserButton.module.css";

export function UserButton() {
  const user = useStore((state) => state.user);
  return (
    <UnstyledButton  className={classes.user}>
      <Group>
        {user?.user?.image ? (
          <Avatar src={user?.user?.image} radius="xl" />
        ) : (
          <Avatar src={<IconUser />} radius="xl" />
        )}

        <div style={{ flex: 1,overflow:"hidden" }}>
          <Text size="sm" fw={500}>
            {user?.user?.name}
          </Text>

          <Text c="dimmed" size="xs">
            {user?.user?.email}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
