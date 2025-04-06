"use client";
import { useEffect, useRef, useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  Button,
  Center,
  Dialog,
  Drawer,
  Flex,
  Group,
  keys,
  Modal,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import classes from "./TableSort.module.css";
import { DateTime } from "luxon";
import { DownloadTableExcel } from "react-export-table-to-excel";
import AlertLoading from "./AlertLoading";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";
import Report from "./Report";
import Link from "next/link";

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group style={{ width: "200px" }} justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key].toString().toLowerCase().includes(query)
    )
  );
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].toString().localeCompare(a[sortBy]);
      }

      return a[sortBy].toString().localeCompare(b[sortBy]);
    }),
    payload.search
  );
}
const isPresent = (
  attendancedata,
  studentsdata,
  currentdate,
  workingDays,
  nonworkingDates,
  updatedata
) => {
  const attdata = attendancedata.filter((data) => {
    return (
      DateTime.fromISO(data.date).toFormat("dd/MM/yyyy") ==
      currentdate.toFormat("dd/MM/yyyy")
    );
  });
  let updatedataarr = [];
  let isinsertmany = false;
  let insertindex = -1;
  updatedata.forEach((data, index) => {
    if (data?.insertMany) {
      isinsertmany = true;
      insertindex = index;
    }
  });
  if (isinsertmany) {
    updatedataarr = updatedata[insertindex].insertMany.documents.filter(
      (data) => {
        return data.date == currentdate.toFormat("yyyy/MM/dd");
      }
    );
  }
  if (
    !workingDays.includes(currentdate.toLocaleString({ weekday: "short" })) ||
    nonworkingDates.includes(currentdate.toFormat("dd/MM/yyyy"))
  ) {
    return { leter: "-", attendanceid: "" };
  }
  if (attdata.length > 0 || updatedataarr.length > 0) {
    if (
      attdata[0]?.students?.includes(studentsdata.enNo) ||
      updatedataarr[0]?.students?.includes(studentsdata.enNo)
    ) {
      return { leter: "P", attendanceid: attdata[0]?._id };
    } else {
      return { leter: "A", attendanceid: attdata[0]?._id };
    }
  } else {
    return { leter: "A", attendanceid: "" };
  }
};

const AttendanceTable = ({
  attendencedataprops = [],
  studentsdata,
  currentmonth,
  registerdata,
  workingDays = [],
  nonworkingDates = [],
  classtype,
  editmod,
  resetdata,
  switchopened,
}) => {
  const [attendencedata, setAttendencedata] = useState([]);
  const [updateattdencedata, setUpdateattdencedata] = useState([]);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(studentsdata);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [daysinmonth, setDaysinmonth] = useState([]);
  const [isdataset, setIsdataset] = useState(false);
  const [alertbox, setAlertbox] = useState("");
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const tableRef = useRef();
  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(studentsdata, { sortBy: field, reversed, search }));
  };
  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(studentsdata, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const setdaysmonth = () => {
    const monthdaysarr = [];
    for (
      let index = 1;
      index <=
      DateTime.fromISO(new Date(currentmonth).toISOString()).daysInMonth;
      index++
    ) {
      monthdaysarr.push(index);
    }
    setDaysinmonth(monthdaysarr);
  };
  const rows = sortedData.map((row, index) => {
    let total = 0;
    let workingday = 0;
    return (
      <Table.Tr key={row._id}>
        <Table.Th>{index + 1}</Table.Th>
        <Table.Th>
        <Link href={`/student/${row.enNo}`}>
          {row.enNo}
        </Link>
          </Table.Th>
        <Table.Th>{row.name}</Table.Th>
        {daysinmonth.map((day) => {
          const date = DateTime.fromISO(
            new Date(currentmonth).toISOString()
          ).set({
            day: day,
          });
          if (
            date.toMillis() <= DateTime.now().toMillis() &&
            date.toMillis() <= DateTime.fromISO(registerdata.enddate).toMillis()
          ) {
            let leter = isPresent(
              attendencedata,
              row,
              date,
              workingDays,
              nonworkingDates,
              updateattdencedata
            );
            if (leter.leter == "A" || leter.leter == "P") {
              workingday++;
            }
            if (leter.leter == "P") {
              total++;
            }
            let color = leter.leter == "P" ? "#00800042" : "#ff000042";
            if (leter.leter == "-") {
              color = "";
            }
            return (
              <Table.Th key={row._id + index + day}>
                <Center>
                  <Text
                    style={{
                      backgroundColor: color,
                      width: "30px",
                      height: "30px",
                      textAlign: "center",
                      borderRadius: "30px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => {
                      if (!(leter.leter == "-") && editmod) {
                        let index = -1;
                        attendencedata.forEach((data, i) => {
                          if (data._id == leter.attendanceid) {
                            index = i;
                          }
                        });
                        if (index > -1) {
                          const attarr = [...attendencedata];
                          if (attarr[index].students.includes(row.enNo)) {
                            const enindex = attarr[index].students.indexOf(
                              row.enNo
                            );
                            attarr[index].students.splice(enindex, 1);
                            setAttendencedata(attarr);
                          } else {
                            attarr[index].students.push(row.enNo);
                            setAttendencedata(attarr);
                          }
                          let updateindex = -1;
                          updateattdencedata.forEach((data, index) => {
                            if (
                              data?.updateOne?.filter?._id == leter.attendanceid
                            ) {
                              updateindex = index;
                            }
                          });
                          const updatedata = [...updateattdencedata];
                          if (updateindex > -1) {
                            updatedata[updateindex].updateOne.update[
                              "$set"
                            ].students = attendencedata[index].students;
                          } else {
                            updatedata.push({
                              updateOne: {
                                filter: { _id: attendencedata[index]._id },
                                update: {
                                  $set: {
                                    students: attendencedata[index].students,
                                  },
                                },
                              },
                            });
                          }
                          setUpdateattdencedata(updatedata);
                        } else {
                          let inserobjindex = -1;
                          let insertindex = -1;
                          const updatedata = [...updateattdencedata];
                          let isinsertmany = false;
                          updatedata.forEach((data) => {
                            if (data?.insertMany) {
                              isinsertmany = true;
                            }
                          });
                          if (!isinsertmany) {
                            updatedata.push({ insertMany: { documents: [] } });
                          }
                          updatedata.forEach((data, index) => {
                            if (data?.insertMany) {
                              inserobjindex = index;
                              if (data.insertMany.documents.length > 0) {
                                data.insertMany.documents.forEach(
                                  (insertdata, insindex) => {
                                    if (
                                      insertdata.classtype == classtype &&
                                      insertdata.date ==
                                        date.toFormat("yyyy/MM/dd") &&
                                      insertdata.registerid == registerdata._id
                                    ) {
                                      insertindex = insindex;
                                    }
                                  }
                                );
                              }
                            }
                          });
                          if (insertindex > -1 && inserobjindex > -1) {
                            if (
                              updatedata[inserobjindex].insertMany.documents[
                                insertindex
                              ].students.includes(row.enNo)
                            ) {
                              const enindex = updatedata[
                                inserobjindex
                              ].insertMany.documents[
                                insertindex
                              ].students.indexOf(row.enNo);

                              updatedata[inserobjindex].insertMany.documents[
                                insertindex
                              ].students.splice(enindex, 1);
                            } else {
                              updatedata[inserobjindex].insertMany.documents[
                                insertindex
                              ].students.push(row.enNo);
                            }
                          } else {
                            updatedata[inserobjindex].insertMany.documents.push(
                              {
                                registerid: registerdata._id,
                                students: [row.enNo],
                                date: date.toFormat("yyyy/MM/dd"),
                                classtype: classtype,
                              }
                            );
                          }
                          setUpdateattdencedata(updatedata);
                        }
                      }
                    }}
                  >
                    {leter.leter}
                  </Text>
                </Center>
              </Table.Th>
            );
          } else {
            return <Table.Th key={date.toMillis()}></Table.Th>;
          }
        })}
        <Table.Th>
          <Text style={{ textAlign: "center" }}>{total}</Text>
        </Table.Th>
        <Table.Th>
          <Text style={{ textAlign: "center" }}>
            {((total * 100) / workingday).toFixed(2)}
          </Text>
        </Table.Th>
      </Table.Tr>
    );
  });

  useEffect(() => {
    if (!isdataset) {
      setAttendencedata([...attendencedataprops]);
      setIsdataset(true);
    }
    setdaysmonth();
    resetdata([
      () => {
        setAttendencedata([...attendencedataprops]);
        setUpdateattdencedata([]);
      },
    ]);
  }, [currentmonth, attendencedata]);
  return (
    <>
      <Group></Group>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <ScrollArea style={{ marginBottom: "10px" }}>
        <Table
          ref={tableRef}
          withTableBorder
          withColumnBorders
          stickyHeader
          highlightOnHover
          miw={700}
          verticalSpacing={"sm"}
          horizontalSpacing={"md"}
          layout="auto"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SR</Table.Th>
              <Th
                sorted={sortBy === "enNo"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("enNo")}
              >
                Enrollment No
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                Name
              </Th>
              {daysinmonth.map((day, index) => {
                const date = DateTime.fromISO(
                  new Date(currentmonth).toISOString()
                ).plus({ days: index });
                return (
                  <Table.Th
                    key={`${day}${index}`}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Text>
                      {date.toFormat("dd/MM/yyyy")}
                      <br />
                      {date.toLocaleString({ weekday: "short" })}
                      <br />
                      {day}
                    </Text>
                  </Table.Th>
                );
              })}
              <Table.Th>Total</Table.Th>
              <Table.Th>Percentage</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              <>
                {rows}
                <Table.Tr>
                  <Table.Th>Total</Table.Th>
                  <Table.Th></Table.Th>
                  <Table.Th></Table.Th>

                  {daysinmonth.map((day, index) => {
                    // Total of Day
                    let ispresent = false;
                    let insertindex = -1;
                    let studentarr = [];

                    const currentmonthdate = DateTime.fromISO(
                      new Date(currentmonth).toISOString()
                    ).set({ day: day });
                    let daytotal = 0;
                    if (
                      currentmonthdate.toMillis() <=
                        DateTime.now().toMillis() &&
                      currentmonthdate.toMillis() <=
                        DateTime.fromISO(registerdata.enddate).toMillis()
                    ) {
                      updateattdencedata.forEach((data, index) => {
                        if (data?.insertMany) {
                          ispresent = true;
                          insertindex = index;
                        }
                      });
                      if (ispresent) {
                        updateattdencedata[
                          insertindex
                        ].insertMany.documents.forEach((data) => {
                          if (
                            data.date == currentmonthdate.toFormat("yyyy/MM/dd")
                          ) {
                            studentarr = data.students;
                          }
                        });
                      }
                      const totalday = attendencedata.filter((data) => {
                        const date = DateTime.fromISO(data.date).toFormat(
                          "dd/MM/yyyy"
                        );
                        return (
                          date == currentmonthdate.toFormat("dd/MM/yyyy") &&
                          workingDays.includes(
                            currentmonthdate.toLocaleString({
                              weekday: "short",
                            })
                          ) &&
                          !nonworkingDates.includes(
                            currentmonthdate.toFormat("dd/MM/yyyy")
                          )
                        );
                      });
                      if (totalday[0]) {
                        totalday[0].students = totalday[0].students.filter(
                          (student) => registerdata.students.includes(student)
                        );
                      }
                      let attstudents =
                        totalday[0]?.students.length > 0
                          ? totalday[0].students
                          : [];
                      if (attstudents.length > 0 || studentarr.length > 0) {
                        daytotal = new Set([...attstudents, ...studentarr])
                          .size;
                      }
                    }
                    return (
                      <Table.Th key={`${day}${index}`}>
                        <Center>{daytotal}</Center>
                      </Table.Th>
                    );
                  })}
                  <Table.Th></Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </>
            ) : (
              <Table.Tr>
                <Table.Td colSpan={Object.keys(studentsdata[0]).length}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      <Dialog opened={switchopened} size="xs" radius="md">
        <Group align="center" justify="center">
          <Button
            onClick={async () => {
              setAlertbox(<AlertLoading />);
              fetch("/api/attendance/updateattdence", {
                method: "POST",
                body: JSON.stringify({
                  updateattdencedata,
                  registerid: registerdata._id,
                }),
              }).then(async (data) => {
                let res = await data.json();
                if (res.success) {
                  setAlertbox(
                    <AlertSuccess
                      title={"Done"}
                      message={res.message}
                      close={() => {
                        setAlertbox("");
                      }}
                    />
                  );
                  window.location.reload();
                } else {
                  setAlertbox(
                    <AlertError
                      title={"Error"}
                      message={res.message}
                      close={() => {
                        setAlertbox("");
                      }}
                    />
                  );
                }
              });
            }}
          >
            Save {classtype}
          </Button>
        </Group>
      </Dialog>
      <Flex align={"center"} style={{ marginTop: "10px" }} gap={"md"}>
        <DownloadTableExcel
          filename={`${registerdata.subjectname}_S${registerdata.sem}D${registerdata.div}_${classtype}_${currentmonth}`}
          sheet="Sheet1"
          currentTableRef={tableRef.current}
        >
          <Button> Export excel </Button>
        </DownloadTableExcel>
        <Button onClick={open}>Report</Button>
      </Flex>
      <Drawer
        size="100%"
        radius="md"
        position="bottom"
        opened={opened}
        onClose={close}
        offset={5}
        title={"Report " + classtype}
      >
        <Report
          classtype={classtype}
          registerdata={registerdata}
          studentsdata={studentsdata}
          attendencedataprops={attendencedataprops}
          nonworkingDates={nonworkingDates}
          workingDays={workingDays}
        />
      </Drawer>
      {alertbox}
    </>
  );
};

export default AttendanceTable;
