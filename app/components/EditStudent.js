"use client";
import { Box, Button, Select, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import AlertLoading from "./AlertLoading";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";

const EditStudent = ({ studentdata, setstudentdata, close }) => {
  const [alertbox, setAlertbox] = useState("");

  const [formData, setFormData] = useState({
    enNo: "",
    name: "",
    email: "",
    phoneNo: "",
    sem: "",
    div: "",
  });

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle Select changes
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setAlertbox(<AlertLoading />);

    const res = await fetch("/api/student/editstudent", {
      method: "POST",
      body: JSON.stringify({
        formData,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setAlertbox(
        <AlertSuccess
          title={"Done"}
          message={data.message}
          close={() => setAlertbox("")}
        />
      );
      setstudentdata(formData);
      close();
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
    if (studentdata.hasOwnProperty("email")) {
      setFormData({
        ...studentdata,
        sem: studentdata.sem.toString(),
        div: studentdata.div.toString(),
      });
    }
  }, []);

  return (
    <Box style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      <TextInput
        label="Enrollment Number"
        type="number"
        name="enNo"
        placeholder="Enter enrollment number"
        value={formData.enNo}
        onChange={handleChange}
        required
      />
      <TextInput
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your name"
        required
      />
      <TextInput
        label="Email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        required
      />
      <TextInput
        name="phoneNo"
        label="Phone Number"
        type="number"
        placeholder="Enter your phone number"
        value={formData.phoneNo}
        onChange={handleChange}
        required
      />
      <Select
        label="Semester"
        placeholder="Select semester"
        value={formData.sem}
        onChange={(value) => handleSelectChange("sem", value)}
        data={["1", "2", "3", "4", "5", "6"]}
        required
      />
      <Select
        label="Division"
        placeholder="Select division"
        value={formData.div}
        onChange={(value) => handleSelectChange("div", value)}
        data={["1", "2", "3"]}
        required
      />
      <Button onClick={handleSubmit} fullWidth style={{ marginTop: "20px" }}>
        Save
      </Button>
      {alertbox}
    </Box>
  );
};

export default EditStudent;
