"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  IconCalendar,
  IconChevronDown,
  IconEdit,
  IconFreeRights,
  IconPackage,
  IconSquareCheck,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import {
  Button,
  Card,
  Center,
  Collapse,
  Dialog,
  Drawer,
  Flex,
  Group,
  Input,
  Menu,
  Modal,
  MultiSelect,
  Paper,
  SegmentedControl,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { DateTime, Interval } from "luxon";
import { Carousel } from "@mantine/carousel";
import AttendanceTable from "@/app/components/AttendanceTable";
import { useDisclosure } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";
import AlertLoading from "@/app/components/AlertLoading";
import AlertError from "@/app/components/AlertError";
import AlertSuccess from "@/app/components/AlertSuccess";
import EditRegister from "@/app/components/EditRegister";
import { useRouter } from "next/navigation";

const calmonth = (d1, d2) => {
  const now = DateTime.fromISO(d1);
  const later = DateTime.fromISO(d2);
  let tempdate = now;
  const montharr = [];
  for (;;) {
    if (tempdate.toMillis() < later.toMillis()) {
      if (!montharr.includes(tempdate.toFormat("MMMM yyyy"))) {
        montharr.push(tempdate.toFormat("MMMM yyyy"));
      }
      tempdate = tempdate.plus({ days: 1 });
    } else {
      break;
    }
  }
  return montharr;
};

const RegisterPage = ({ params }) => {
  const [studentsdata, setstudentsdata] = useState([]);
  const [registerdata, setRegisterdata] = useState({});
  const [attendencedata, setAttendencedata] = useState([]);
  const [montharr, setMontharr] = useState([]);
  const [currentmonth, setCurrentmonth] = useState("");
  const [openedlab, togglelab] = useDisclosure(false);
  const [openedlec, togglelec] = useDisclosure(false);
  const [workingDaysLab, setWorkingDaysLab] = useState([]);
  const [nonworkingdateLab, setNonworkingdateLab] = useState([]);
  const [workingDaysLec, setWorkingDaysLec] = useState([]);
  const [nonworkingdateLec, setNonworkingdateLec] = useState([]);
  const nonworkingdateLabpicker = useRef();
  const nonworkingdateLecpicker = useRef();
  const [openedLabModal, openecloseLabModal] = useDisclosure(false);
  const [switchopenedLab, setSwitchopenedLab] = useState(false);
  const [openedLecModal, openecloseLecModal] = useDisclosure(false);
  const [switchopenedLec, setSwitchopenedLec] = useState(false);
  const [resetdataLab, setResetdataLab] = useState();
  const [resetdataLec, setResetdataLec] = useState();
  const [alertbox, setAlertbox] = useState("");
  const [editopened, editfunction] = useDisclosure(false);
  const [deleteopened, setDeleteOpened] = useState(false);
  const router = useRouter();

  const deleteRegister = async () => {
    setAlertbox(<AlertLoading />);
    const res = await fetch(
      "/api/register/deleteregister",
      {
        method: "POST",
        body: JSON.stringify({
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
      router.replace("/register");
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
  };
  const getstudentdetail = async () => {
    setAlertbox(<AlertLoading />);
    const res = await fetch(
      "/api/attendance/getstudents",
      {
        method: "POST",
        body: JSON.stringify({
          registerid: (await params).registerid,
          withatt: true,
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setstudentsdata(data.payload.students);
      setRegisterdata(data.payload.register);
      setAttendencedata(data.payload.attendecne);
      setAlertbox("");
      const montharrlocal = calmonth(
        data.payload.register.startdate,
        data.payload.register.enddate
      );
      setMontharr(montharrlocal);
      setCurrentmonth(montharrlocal[0]);
      setWorkingDaysLab(data.payload.register.workingDaysLab);
      setWorkingDaysLec(data.payload.register.workingDaysLec);

      const datesarrLab = [];
      data.payload.register.nonworkingdateLab.forEach((date) => {
        datesarrLab.push(new Date(date));
      });
      setNonworkingdateLab(datesarrLab);

      const datesarrLec = [];
      data.payload.register.nonworkingdateLec.forEach((date) => {
        datesarrLec.push(new Date(date));
      });
      setNonworkingdateLec(datesarrLec);
    } else {
      setAlertbox(
        <AlertError
          title={"Error"}
          close={() => {
            setAlertbox("");
          }}
        />
      );
    }
  };
  useEffect(() => {
    getstudentdetail();
  }, []);
  return (
    <>
      <div suppressHydrationWarning style={{ padding: "10px" }}>
        <Paper shadow="sm" radius="lg" p="xl">
          <Text>Subject Name: {registerdata?.subjectname}</Text>
          <Text>Sem: {registerdata?.sem}</Text>
          <Text>Div: {registerdata?.div}</Text>
          <Text>Term: {registerdata?.term}</Text>
          <Flex style={{ marginTop: "10px" }} justify={"space-between"}>
            <Button
              color="blue"
              variant="light"
              leftSection={<IconEdit size={16} />}
              onClick={editfunction.open}
            >
              Edit
            </Button>
            <Button
              color="red"
              variant="light"
              leftSection={<IconTrash size={16} />}
              onClick={() => {
                setDeleteOpened(true);
              }}
            >
              Delete
            </Button>
          </Flex>
        </Paper>
        <Drawer
          opened={editopened}
          onClose={editfunction.close}
          title="Edit Register Detail"
        >
          <EditRegister
            getstudentdetail={getstudentdetail}
            close={editfunction.close}
            registerdata={registerdata}
          />
        </Drawer>
        <Modal
          opened={deleteopened}
          onClose={() => setDeleteOpened(false)}
          title={"Delete register"}
          centered
        >
          <Text size="sm" mb="md">
            Are you sure you want to delete this Register
          </Text>
          <Group position="apart">
            <Button
              color="green"
              onClick={() => {
                deleteRegister();
              }}
            >
              Confirm
            </Button>
            <Button
              color="red"
              onClick={() => {
                setDeleteOpened(false);
              }}
            >
              Cancel
            </Button>
          </Group>
        </Modal>
        <Group style={{ margin: "10px 0" }}>
          <Paper shadow="sm" radius="lg">
            <Carousel
              onSlideChange={(e) => {
                setCurrentmonth(montharr[e]);
              }}
              w={250}
              height={50}
              slideGap="md"
              draggable={false}
            >
              {montharr.map((data) => (
                <Carousel.Slide
                  style={{ display: "grid", placeItems: "center" }}
                  key={data}
                >
                  <Text ta="center" unselectable="on">
                    {data}
                  </Text>
                </Carousel.Slide>
              ))}
            </Carousel>
          </Paper>
        </Group>
        {studentsdata.length > 0 ? (
          <>
            <Paper
              sshadow="sm"
              radius="lg"
              p="sm"
              style={{ margin: "10px 0", width: "100%" }}
            >
              <Text
                style={{ cursor: "pointer" }}
                fz={20}
                onClick={togglelab.toggle}
              >
                Lab
              </Text>

              <Collapse in={openedlab}>
                <Group
                  style={{ margin: "10px " }}
                  justify="space-between"
                  align="center"
                >
                  <Button onClick={openecloseLabModal.open}>
                    Working Time
                  </Button>
                  <Group>
                    <Switch
                      labelPosition="left"
                      label="Edit Mode"
                      onChange={(e) => {
                        setSwitchopenedLab(e.currentTarget.checked);
                        resetdataLab[0]();
                      }}
                      size="md"
                      onLabel="ON"
                      offLabel="OFF"
                    />
                  </Group>
                </Group>
                <Modal
                  opened={openedLabModal}
                  onClose={openecloseLabModal.close}
                  title="Working Time Lab"
                >
                  <Group align="end" style={{ margin: "10px" }}>
                    <MultiSelect
                      label="Working Days"
                      placeholder="Pick Days"
                      value={workingDaysLab}
                      onChange={(e) => {
                        setWorkingDaysLab(e);
                      }}
                      data={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                    />

                    <DatePickerInput
                      style={{ display: "", top: "50%", left: "50%" }}
                      ref={nonworkingdateLabpicker}
                      leftSection={<IconCalendar />}
                      type="multiple"
                      label="None Working Date"
                      placeholder="Date"
                      value={nonworkingdateLab}
                      minDate={new Date(registerdata.startdate)}
                      maxDate={new Date(registerdata.enddate)}
                      onChange={(e) => {
                        setNonworkingdateLab(e);
                      }}
                    />
                    <Button
                      onClick={async () => {
                        setAlertbox(<AlertLoading />);
                        await fetch(
                          "/api/register/updateworkingdates",
                          {
                            method: "POST",
                            body: JSON.stringify({
                              classtype: "Lab",
                              workingDaysLab,
                              nonworkingdateLab,
                              registerid: registerdata._id,
                            }),
                          }
                        ).then(async (data) => {
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
                      Save
                    </Button>
                  </Group>
                </Modal>
                <AttendanceTable
                  attendencedataprops={attendencedata.filter(
                    (data) => data.classtype === "Lab"
                  )}
                  currentmonth={currentmonth}
                  studentsdata={studentsdata}
                  registerdata={registerdata}
                  workingDays={workingDaysLab}
                  nonworkingDates={nonworkingdateLab.map((date) =>
                    date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  )}
                  classtype={"Lab"}
                  editmod={switchopenedLab}
                  resetdata={setResetdataLab}
                  switchopened={switchopenedLab}
                />
              </Collapse>
            </Paper>
            <Paper
              sshadow="sm"
              radius="lg"
              p="sm"
              style={{ margin: "10px 0", width: "100%" }}
            >
              <Text
                style={{ cursor: "pointer" }}
                onClick={togglelec.toggle}
                fz={20}
              >
                Lec
              </Text>
              <Collapse in={openedlec}>
                <Group
                  style={{ margin: "10px " }}
                  justify="space-between"
                  align="center"
                >
                  <Button onClick={openecloseLecModal.open}>
                    Working Time Lec
                  </Button>
                  <Group>
                    <Switch
                      labelPosition="left"
                      label="Edit Mode"
                      onChange={(e) => {
                        setSwitchopenedLec(e.currentTarget.checked);
                        resetdataLec[0]();
                      }}
                      size="md"
                      onLabel="ON"
                      offLabel="OFF"
                    />
                  </Group>
                </Group>
                <Modal
                  opened={openedLecModal}
                  onClose={openecloseLecModal.close}
                  title="Working Time Lec"
                >
                  <Group align="end" style={{ margin: "10px" }}>
                    <MultiSelect
                      label="Working Days"
                      placeholder="Pick Days"
                      value={workingDaysLec}
                      onChange={(e) => {
                        setWorkingDaysLec(e);
                      }}
                      data={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                    />

                    <DatePickerInput
                      style={{ display: "", right: "200px", top: "200px" }}
                      ref={nonworkingdateLecpicker}
                      leftSection={<IconCalendar />}
                      type="multiple"
                      label="None Working Date"
                      placeholder="Date"
                      value={nonworkingdateLec}
                      minDate={new Date(registerdata.startdate)}
                      maxDate={new Date(registerdata.enddate)}
                      onChange={(e) => {
                        setNonworkingdateLec(e);
                      }}
                    />
                    <Button
                      onClick={async () => {
                        setAlertbox(<AlertLoading />);
                        await fetch(
                          "/api/register/updateworkingdates",
                          {
                            method: "POST",
                            body: JSON.stringify({
                              classtype: "Lec",
                              workingDaysLec,
                              nonworkingdateLec,
                              registerid: registerdata._id,
                            }),
                          }
                        ).then(async (data) => {
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
                      Save
                    </Button>
                  </Group>
                </Modal>
                <AttendanceTable
                  attendencedataprops={attendencedata.filter(
                    (data) => data.classtype === "Lec"
                  )}
                  currentmonth={currentmonth}
                  studentsdata={studentsdata}
                  registerdata={registerdata}
                  workingDays={workingDaysLec}
                  nonworkingDates={nonworkingdateLec.map((date) =>
                    date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  )}
                  classtype={"Lec"}
                  editmod={switchopenedLec}
                  resetdata={setResetdataLec}
                  switchopened={switchopenedLec}
                />
              </Collapse>
            </Paper>
          </>
        ) : (
          ""
        )}
      </div>
      {alertbox}
    </>
  );
};

export default RegisterPage;
