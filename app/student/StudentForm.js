import {
  Button,
  Fieldset,
  NativeSelect,
  Paper,
  Select,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import AlertLoading from "../components/AlertLoading";
import AlertError from "../components/AlertError";
import AlertSuccess from "../components/AlertSuccess";

const StudentForm = () => {
  const [studentdata, setStudentdata] = useState({});
  const [alertbox, setAlertbox] = useState("");
  const handlechange = (e) => {
    studentdata[e.target.name] = e.target.value;
    setStudentdata(studentdata);
  };
  const addStudent = async () => {
    function valid(email) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    }
    if (
      studentdata.enNo &&
      studentdata.name &&
      studentdata.email &&
      studentdata.phoneNo &&
      studentdata.sem &&
      studentdata.div &&
      valid(studentdata.email)
    ) {
      setAlertbox(<AlertLoading />);
      const res = await fetch("/api/student/addone", {
        method: "POST",
        body: JSON.stringify(studentdata),
      });
      const data = await res.json();
      if (data.success) {
        setAlertbox(
          <AlertSuccess
            close={() => setAlertbox("")}
            title={"Done"}
            message={data.message}
          />
        );
      } else {
        setAlertbox(
          <AlertError
            close={() => setAlertbox("")}
            title={"Error"}
            message={data.message}
          />
        );
      }
    }
  };
  return (
    <>
      <Paper shadow="sm" p="xl" radius="lg">
        <Fieldset
          style={{ padding: "10px", margin: "10px 0" }}
          w={300}
          legend="Student information"
        >
          <TextInput
            name="enNo"
            type="number"
            onInput={handlechange}
            label="Enrollment No"
            placeholder="Enrollment No"
          />
          <TextInput
            name="name"
            onInput={handlechange}
            label="Name"
            placeholder="Name"
            mt="md"
          />
          <TextInput
            name="email"
            onInput={handlechange}
            description="Student Login only work with Gmail."
            label="Email"
            placeholder="Email"
            mt="md"
          />
          <TextInput
            name="phoneNo"
            onInput={handlechange}
            label="Phone Number"
            type="number"
            placeholder="Phone Number"
            mt="md"
          />
          <Select
            name="sem"
            onChange={(e) => {
              studentdata["sem"] = e;
              setStudentdata(studentdata);
            }}
            label="Sem"
            data={["1", "2", "3", "4", "5", "6"]}
          />
          <Select
            name="div"
            onChange={(e) => {
              studentdata["div"] = e;
              setStudentdata(studentdata);
            }}
            label="Div"
            data={["1", "2", "3"]}
          />
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={addStudent}
              style={{ margin: "10px" }}
              variant="filled"
              radius="xl"
            >
              Submit
            </Button>
          </div>
        </Fieldset>
      </Paper>
      {alertbox}
    </>
  );
};

export default StudentForm;
