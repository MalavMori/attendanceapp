import React from "react";
import { IconLogout } from "@tabler/icons-react";
import { Menu } from "@mantine/core";
import { signOut } from "next-auth/react";

const UserMenu = ({ target }) => {
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>{target}</Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            color="red"
            onClick={() => {
              signOut();
            }}
            leftSection={<IconLogout size={14} />}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
