"use client";
import AlertError from "@/app/components/AlertError";
import AlertLoading from "@/app/components/AlertLoading";
import AlertSuccess from "@/app/components/AlertSuccess";
import EditStudent from "@/app/components/EditStudent";
import { UserProfileCard } from "@/app/components/Profile";
import { Button, Center, Dialog, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const StudentPage = ({ params }) => {
  const [editdialog, editdialogFun] = useDisclosure(true);
  const [editmodal, editmodalFun] = useDisclosure(false);
  const [studentdata, setStudentdata] = useState({});
  const [deleteopened, setDeleteOpened] = useState(false);
  const [alertbox, setAlertbox] = useState("");
  const router = useRouter()


  const getstudentdata = async () => {
    setAlertbox(<AlertLoading />);

    const res = await fetch("/api/student/getstudent", {
      method: "POST",
      body: JSON.stringify({
        studentid: (await params).studentid,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      setStudentdata(data.payload);
      setAlertbox(
        <AlertSuccess
          title={"Done"}
          message={data.message}
          close={() => setAlertbox("")}
        />
      );
    } else {
      setAlertbox(
        <AlertError
          title={"Error"}
          message={data.message}
          close={() => setAlertbox("")}
        />
      );
    }
  };
  const handleDelete = async () => {
    setAlertbox(<AlertLoading />);

    const res = await fetch("/api/student/deletestudent", {
      method: "POST",
      body: JSON.stringify({
        studentid: studentdata._id,
      }),
    });
    const data = await res.json()
    console.log(data)
    if (data.success) {
      setAlertbox(
        <AlertSuccess
          title={"Done"}
          message={data.message}
          close={() => setAlertbox("")}
        />
      );
      router.back();
    } else {
      setAlertbox(
        <AlertError
          title={"Error"}
          message={data.message}
          close={() => setAlertbox("")}
        />
      );
    }
  };
  useEffect(() => {
    getstudentdata();
  }, []);
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <UserProfileCard {...studentdata} usertype={"student"} self={false} />

      {studentdata?.email && (
        <Dialog opened={editdialog} size={280} radius="md">
          <Flex gap={"sm"} justify={"space-between"}>
            <Button
              fullWidth
              onClick={editmodalFun.open}
              leftSection={<IconEdit />}
            >
              Edit
            </Button>
            <Button
              fullWidth
              color="red"
              onClick={() => {
                setDeleteOpened(true);
              }}
              leftSection={<IconTrash />}
            >
              Delete
            </Button>
          </Flex>
        </Dialog>
      )}
      <Modal
        opened={editmodal}
        onClose={editmodalFun.close}
        title="Edit Student"
      >
        <EditStudent
          setstudentdata={setStudentdata}
          studentdata={studentdata}
          close={editmodalFun.close}
        />
      </Modal>
      <Modal
        opened={deleteopened}
        onClose={() => setDeleteOpened(false)}
        title="Delete Confirmation"
        centered
      >
        <Text>Are you sure you want to delete this student's data? </Text>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            variant="outline"
            onClick={() => setDeleteOpened(false)}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
      {alertbox}
    </div>
  );
};

export default StudentPage;
