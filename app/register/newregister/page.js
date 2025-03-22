"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import AlertSuccess from "@/app/components/AlertSuccess";
import AlertError from "@/app/components/AlertError";
import AlertLoading from "@/app/components/AlertLoading";
import { useRouter } from "next/navigation";

const getDaysArray = function (start, end) {
  const arr = [];
  for (
    const dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

const formatDate = (date) => {
  const newdate = new Date(date);
  return `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`;
};

const NewRegister = () => {
  const [startdate, setStartdate] = useState();
  const [enddate, setEnddate] = useState();
  const [sem, setSem] = useState(0);
  const [div, setDiv] = useState(0);
  const [term, setTerm] = useState(0);
  const [subjectname, setSubjectname] = useState("");
  const [subjectcode, setSubjectcode] = useState("");
  const [alertbox, setAlertbox] = useState("");
  const router = useRouter()

  const newregister = async () => {
    if (
      sem &&
      div &&
      subjectname &&
      subjectcode &&
      startdate &&
      enddate &&
      term
    ) {
      setAlertbox(<AlertLoading />);
      const res = await fetch("/api/newregister", {
        method: "POST",
        body: JSON.stringify({
          sem,
          div,
          subjectname,
          subjectcode,
          term,
          startdate: formatDate(startdate),
          enddate: formatDate(enddate),
        }),
      });
      const data = await res.json()
      if(data.success){
        setAlertbox(<AlertSuccess title={"Done"} message={data.message} close={()=>{setAlertbox("")}} />)
        router.push("/register")
        
      }else{
        setAlertbox(<AlertError title={"Error"} message={data.message} close={()=>{setAlertbox("")}} />)
      }
    }
  };

  useEffect(() => {
    const arr = getDaysArray(startdate, enddate);
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    arr.forEach((date) => {
    });
  }, [enddate]);
  return (
    <div style={{ padding: "10px" }}>
      <Text size="lg">New Register</Text>
      <Divider my="md" />
      <Paper shadow="sm" radius="lg" p="xl">
        <Group>
          <Group justify="">
            <Select
              label="Sem"
              placeholder="Sem"
              name="sem"
              onChange={setSem}
              data={["1", "2", "3", "4", "5", "6"]}
            />
            <Select
              name="div"
              onChange={setDiv}
              label="Div"
              placeholder="Div"
              data={["1", "2", "3"]}
            />
            <TextInput
              name="subjectname"
              onChange={(e) => {
                setSubjectname(e.target.value);
              }}
              label="Subject Name"
              placeholder="Subject Name"
            />
            <NumberInput
              name="subjectcode"
              onChange={setSubjectcode}
              label="Subject Code"
              placeholder="Subject Code"
            />
            <NumberInput
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
          </Group>
          <Button onClick={newregister}>Create New Register</Button>
        </Group>
      </Paper>
      {alertbox}
    </div>
  );
};

export default NewRegister;
