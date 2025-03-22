"use client";
import {
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AlertLoading from "./AlertLoading";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";

const EditRegister = ({ registerdata, getstudentdetail, close }) => {
  const [startdate, setStartdate] = useState();
  const [enddate, setEnddate] = useState();
  const [sem, setSem] = useState(0);
  const [div, setDiv] = useState(0);
  const [term, setTerm] = useState(0);
  const [subjectname, setSubjectname] = useState("");
  const [subjectcode, setSubjectcode] = useState("");
  const [alertbox, setAlertbox] = useState("");

  const editregister = async () => {
    if (
      sem &&
      div &&
      subjectname &&
      subjectcode &&
      startdate &&
      enddate &&
      term &&
      registerdata._id
    ) {
      setAlertbox(<AlertLoading />);
      const res = await fetch(
        "/api/register/editregister",
        {
          method: "POST",
          body: JSON.stringify({
            sem,
            div,
            subjectname,
            subjectcode,
            term,
            startdate: DateTime.fromISO(startdate.toISOString()).toFormat(
              "yyyy/MM/dd"
            ),
            enddate: DateTime.fromISO(enddate.toISOString()).toFormat(
              "yyyy/MM/dd"
            ),
            registerid: registerdata._id,
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
        close();
        getstudentdetail();
      } else {
        setAlertbox(
          <AlertError
            title={"Error"}
            message={data.message}
            close={() => {
              setAlertbox("");
            }}
          />
        );
      }
    }
  };

  useEffect(() => {
    setStartdate(new Date(registerdata.startdate));
    setEnddate(new Date(registerdata.enddate));
    setSem(registerdata.sem.toString());
    setDiv(registerdata.div.toString());
    setTerm(registerdata.term);
    setSubjectname(registerdata.subjectname);
    setSubjectcode(registerdata.subjectcode);
  }, []);
  return (
    <div>
      <Flex gap={"md"} justify={"center"} direction={"column"}>
        <Select
          label="Sem"
          placeholder="Sem"
          value={sem}
          onChange={setSem}
          data={["1", "2", "3", "4", "5", "6"]}
        />
        <Select
          name="div"
          onChange={setDiv}
          label="Div"
          value={div}
          placeholder="Div"
          data={["1", "2", "3"]}
        />
        <TextInput
          name="subjectname"
          onChange={(e) => {
            setSubjectname(e.target.value);
          }}
          value={subjectname}
          label="Subject Name"
          placeholder="Subject Name"
        />
        <NumberInput
          value={subjectcode}
          name="subjectcode"
          onChange={setSubjectcode}
          label="Subject Code"
          placeholder="Subject Code"
        />
        <NumberInput
          value={term}
          name="term"
          onChange={setTerm}
          label="Term"
          placeholder="Term"
        />
        <DatePickerInput
          onChange={setStartdate}
          label="Term Start Date"
          placeholder="Term Start Date"
          value={startdate}
        />
        <DatePickerInput
          onChange={setEnddate}
          label="Term End Date"
          placeholder="Term End Date"
          value={enddate}
        />
        <Button onClick={editregister}>Edit Register</Button>
      </Flex>
      {alertbox}
    </div>
  );
};

export default EditRegister;
