import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Button,
  Spinner,
  Alert,
  Nav,
  NavItem,
  NavLink,
  FormGroup,
  Label,
  Form,
} from "reactstrap";
import { BACKEND_PREFIX } from "../App";

interface Shift {
  id?: number;
  day: string; // Day of the week (e.g., "Monday")
  start: string; // Start time (e.g., "08:00")
  end: string; // End time (e.g., "12:00")
}

interface WorkGraphic {
  id?: number;
  weekNumber: number;
  year: number;
  shifts: Shift[];
}

const getWeekNumber = (date: Date): { year: number; week: number } => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return { year: date.getFullYear(), week };
};

const WorkerDashboard: React.FC = () => {
  const [weekNumber, setWeekNumber] = useState(getWeekNumber(new Date()));
  const [workGraphic, setWorkGraphic] = useState<WorkGraphic>({
    weekNumber: 0,
    year: 0,
    shifts: [],
  });
  const [activeTab, setActiveTab] = useState("workGraphic");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(
    null
  );
  const [preference, setPreference] = useState("");
  const [freeDay, setFreeDay] = useState("");

  // Fetch the work graphic when the week changes
  useEffect(() => {
    fetchWorkGraphic();
  }, [weekNumber]);

  // Fetch work graphic from the backend
  const fetchWorkGraphic = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_PREFIX}/api/worker/graph?year=${weekNumber.year}&week=${weekNumber.week}`
      );
      // Transform WorkGraphicDTO into WorkGraphic structure
      const transformedData: WorkGraphic = {
        weekNumber: response.data.weekNumber,
        year: weekNumber.year,
        shifts: response.data.workGraphic.flatMap(
          (dayShifts: any, dayIndex: number) => {
            const dayNames = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ];
            return dayShifts.map((shift: any) => ({
              day: dayNames[dayIndex],
              start: shift.start,
              end: shift.end,
            }));
          }
        ),
      };
      setWorkGraphic(transformedData);
    } catch (error) {
      setAlert({ type: "danger", message: "Error fetching work graphic." });
    } finally {
      setLoading(false);
    }
  };

  // Handle week picker changes
  const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, week] = e.target.value.split("-W");
    setWeekNumber({ year: parseInt(year), week: parseInt(week) });
  };

  // Edit specific shift
  const handleEditChange = (
    shiftIndex: number,
    field: keyof Shift,
    value: string
  ) => {
    const updatedGraphic = { ...workGraphic };
    updatedGraphic.shifts[shiftIndex] = {
      ...updatedGraphic.shifts[shiftIndex],
      [field]: value,
    };
    setWorkGraphic(updatedGraphic);
  };

  // Add a new shift for a specific day
  const addShift = (day: string) => {
    const updatedGraphic = { ...workGraphic };
    updatedGraphic.shifts.push({ day, start: "08:00", end: "12:00" });
    setWorkGraphic(updatedGraphic);
  };

  // Validate total hours for the week
  const validateWorkGraphic = () => {
    const totalHours = workGraphic.shifts.reduce((sum, shift) => {
      const start = parseTime(shift.start);
      const end = parseTime(shift.end);
      return sum + (end - start);
    }, 0);

    return totalHours === 40;
  };

  // Parse time string to hours
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  // Save the work graphic
  const saveWorkGraphic = async () => {
    if (!validateWorkGraphic()) {
      setAlert({
        type: "danger",
        message: "Total hours for the week must equal 40!",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${BACKEND_PREFIX}/api/worker/graph`, workGraphic);
      setAlert({
        type: "success",
        message: "Work graphic updated successfully!",
      });
      setEditing(false);
    } catch (error) {
      setAlert({ type: "danger", message: "Error updating work graphic." });
    } finally {
      setLoading(false);
    }
  };

  // Request a free day
  const handleFreeDayRequest = async () => {
    if (!freeDay) {
      setAlert({
        type: "warning",
        message: "Please select a date for the free day!",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_PREFIX}/api/worker/free-days`, {
        date: freeDay,
      });
      setAlert({
        type: "success",
        message: "Free day requested successfully!",
      });
    } catch (error) {
      setAlert({ type: "danger", message: "Error requesting free day." });
    } finally {
      setLoading(false);
    }
  };

  // Generate work graphic
  const generateWorkGraphic = async () => {
    if (!preference) {
      setAlert({ type: "warning", message: "Please select a preference!" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_PREFIX}/api/worker/generate-graph`, {
        year: weekNumber.year,
        week: weekNumber.week,
        preferences: { type: preference },
      });
      setAlert({
        type: "success",
        message: "Work graphic generated successfully!",
      });
      fetchWorkGraphic();
    } catch (error) {
      setAlert({ type: "danger", message: "Error generating work graphic." });
    } finally {
      setLoading(false);
    }
  };

  // Group shifts by day for display
  const groupShiftsByDay = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days.map((day) => ({
      day,
      shifts: workGraphic.shifts.filter((shift) => shift.day === day),
    }));
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Worker Dashboard</h1>
      {alert && <Alert color={alert.type}>{alert.message}</Alert>}

      <Nav tabs className="mb-3">
        <NavItem>
          <NavLink
            active={activeTab === "workGraphic"}
            onClick={() => setActiveTab("workGraphic")}
          >
            Work Graphic
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "freeDays"}
            onClick={() => setActiveTab("freeDays")}
          >
            Free Days
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "generateGraph"}
            onClick={() => setActiveTab("generateGraph")}
          >
            Generate Work Graphic
          </NavLink>
        </NavItem>
      </Nav>

      <FormGroup>
        <Label for="weekPicker">Select Week</Label>
        <Input
          type="week"
          id="weekPicker"
          value={`${weekNumber.year}-W${weekNumber.week
            .toString()
            .padStart(2, "0")}`}
          onChange={handleWeekChange}
        />
      </FormGroup>

      {activeTab === "workGraphic" && (
        <div>
          <h2>
            Work Graphic - Year {weekNumber.year}, Week {weekNumber.week}
          </h2>
          {loading ? (
            <Spinner />
          ) : (
            <Table striped>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Shifts</th>
                </tr>
              </thead>
              <tbody>
                {groupShiftsByDay().map(({ day, shifts }) => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>
                      {shifts.map((shift, shiftIndex) => (
                        <div key={shiftIndex} className="d-flex mb-2">
                          {editing ? (
                            <>
                              <Input
                                type="time"
                                value={shift.start}
                                onChange={(e) =>
                                  handleEditChange(
                                    workGraphic.shifts.indexOf(shift),
                                    "start",
                                    e.target.value
                                  )
                                }
                                className="me-2"
                              />
                              <Input
                                type="time"
                                value={shift.end}
                                onChange={(e) =>
                                  handleEditChange(
                                    workGraphic.shifts.indexOf(shift),
                                    "end",
                                    e.target.value
                                  )
                                }
                              />
                            </>
                          ) : (
                            <span>
                              {shift.start} - {shift.end}
                            </span>
                          )}
                        </div>
                      ))}
                      {editing && (
                        <Button size="sm" onClick={() => addShift(day)}>
                          Add Shift
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <div className="d-flex justify-content-end">
            {editing ? (
              <>
                <Button
                  color="primary"
                  onClick={saveWorkGraphic}
                  disabled={loading}
                >
                  Save
                </Button>
                <Button
                  color="secondary"
                  className="ms-2"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button color="primary" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      )}

      {activeTab === "freeDays" && (
        <div>
          <h2>Request Free Day</h2>
          <Form>
            <FormGroup>
              <Label for="freeDay">Select Date</Label>
              <Input
                type="date"
                id="freeDay"
                value={freeDay}
                onChange={(e) => setFreeDay(e.target.value)}
              />
            </FormGroup>
            <Button
              onClick={handleFreeDayRequest}
              color="primary"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Request Free Day"}
            </Button>
          </Form>
        </div>
      )}

      {activeTab === "generateGraph" && (
        <div>
          <h2>Generate Work Graphic</h2>
          <Form>
            <FormGroup>
              <Label for="preference">Select Preference</Label>
              <Input
                type="select"
                id="preference"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
              >
                <option value="">-- Select Preference --</option>
                {/* <option value="workEveryOtherDay">Work Every Other Day</option> */}
                <option value="onlyWorkDays">Only Work Days</option>
                <option value="longShifts">Long Shifts</option>
              </Input>
            </FormGroup>
            <Button
              onClick={generateWorkGraphic}
              color="primary"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Generate"}
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
