"use client";
import {
  Button,
  Center,
  Flex,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Table,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";

const Report = ({
  attendencedataprops = [],
  studentsdata,
  registerdata,
  workingDays = [],
  nonworkingDates = [],
  classtype,
}) => {
  const [fromdate, setFromdate] = useState(new Date(registerdata.startdate));
  const [todate, setTodate] = useState(
    new Date().getTime() < new Date(registerdata.enddate).getTime()
      ? new Date()
      : new Date(registerdata.enddate)
  );
  const tableRef = useRef();
  const [filterpercentage, setFilterpercentage] = useState("");
  const [reportdata, setReportdata] = useState([]);
  const [filteroperator, setFilteroperator] = useState("");
  const createReport = () => {
    let report = [];
    let currentdate = DateTime.fromISO(fromdate.toISOString());
    let toenddate = DateTime.fromISO(todate.toISOString());
    const workingdates = [];
    while (currentdate.toMillis() <= toenddate.toMillis()) {
      if (
        workingDays.includes(currentdate.weekdayShort) &&
        !nonworkingDates.includes(currentdate.toFormat("dd/MM/yyyy"))
      ) {
        workingdates.push(currentdate.toFormat("dd/MM/yyyy"));
      }
      currentdate = currentdate.plus({ days: 1 });
    }
    studentsdata.forEach((student) => {
      const presents = attendencedataprops.filter((attendance) => {
        return (
          workingdates.includes(
            DateTime.fromISO(attendance.date).toFormat("dd/MM/yyyy")
          ) && attendance.students.includes(student.enNo)
        );
      });
      report.push({
        ...student, 
        percentage: ((presents.length * 100) / workingdates.length).toFixed(2),
      });
    });
    if (filteroperator && filterpercentage) {
      if (filteroperator === "Greater") {
        report = report.filter((data) => {
          return data.percentage > filterpercentage;
        });
      } else {
        report = report.filter((data) => {
          return data.percentage < filterpercentage;
        });
      }
    }
    setReportdata(report);
  };
  useEffect(() => {}, []);
  return (
    <>
      <Center display={"grid"}>
        <Group align="end">
          <DatePickerInput
            minDate={new Date(registerdata.startdate)}
            maxDate={new Date(registerdata.enddate)}
            label="From Date"
            value={fromdate}
            onChange={setFromdate}
          />
          <DatePickerInput
            minDate={new Date(registerdata.startdate)}
            maxDate={new Date(registerdata.enddate)}
            label="To Date"
            value={todate}
            onChange={setTodate}
          />
          <Select
            label="Filter"
            placeholder="Pick value (optional)"
            data={["Greater", "Less"]}
            value={filteroperator}
            onChange={setFilteroperator}
          />
          <NumberInput
            label="Percentage"
            value={filterpercentage}
            onChange={setFilterpercentage}
            placeholder="Percentage (optional)"
          />
          <Button onClick={createReport}>Generate</Button>
        </Group>
        {reportdata.length > 0 ? (
          <>
            <ScrollArea>
              <Table
                style={{ marginBottom: "10px" }}
                ref={tableRef}
                miw={500}
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>SR</Table.Th>
                    <Table.Th>Enrollment No</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Percentage</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reportdata.map((student, index) => {
                    return (
                      <Table.Tr key={student._id}>
                        <Table.Th>{index + 1}</Table.Th>
                        <Table.Th>{student.enNo}</Table.Th>
                        <Table.Th>{student.name}</Table.Th>
                        <Table.Th>{student.percentage}</Table.Th>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </ScrollArea>
            <DownloadTableExcel
              filename={`${registerdata.subjectname}_S${registerdata.sem}D${
                registerdata.div
              }_${classtype}_${fromdate.toLocaleDateString()}_TO_${todate.toLocaleDateString()}`}
              sheet="Sheet1"
              currentTableRef={tableRef.current}
            >
              <Button> Export excel </Button>
            </DownloadTableExcel>
          </>
        ) : (
          <Center>
            <Text>No data found</Text>
          </Center>
        )}
      </Center>
    </>
  );
};

export default Report;
