import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, Spinner, Alert } from "reactstrap";
import { BACKEND_PREFIX } from "../App";

interface Shift {
  start: string;
  end: string;
}

interface WorkGraphic {
  weekNumber: number;
  workGraphic: Shift[][];
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
    workGraphic: [[], [], [], [], [], [], []], // Initialize empty structure for each day
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(
    null
  );

  // Fetch the work graphic for the selected week
  useEffect(() => {
    fetchWorkGraphic();
  }, [weekNumber]);

  const fetchWorkGraphic = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_PREFIX}/api/worker/graph?year=${weekNumber.year}&week=${weekNumber.week}`
      );
      setWorkGraphic(response.data);
    } catch (error) {
      setAlert({ type: "danger", message: "Error fetching work graphic." });
    } finally {
      setLoading(false);
    }
  };

  const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, week] = e.target.value.split("-W");
    setWeekNumber({ year: parseInt(year), week: parseInt(week) });
  };

  const handleEditChange = (
    dayIndex: number,
    shiftIndex: number,
    field: keyof Shift,
    value: string
  ) => {
    const updatedGraphic = { ...workGraphic };
    updatedGraphic.workGraphic[dayIndex][shiftIndex][field] = value;
    setWorkGraphic(updatedGraphic);
  };

  const addShift = (dayIndex: number) => {
    const updatedGraphic = { ...workGraphic };
    updatedGraphic.workGraphic[dayIndex].push({ start: "08:00", end: "12:00" });
    setWorkGraphic(updatedGraphic);
  };

  const validateWorkGraphic = () => {
    const totalHours = workGraphic.workGraphic.flat().reduce((sum, shift) => {
      const start = parseTime(shift.start);
      const end = parseTime(shift.end);
      return sum + (end - start);
    }, 0);

    return totalHours === 40;
  };

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

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

  return (
    <div className="container mt-4">
      <h1 className="text-center">Worker Dashboard</h1>
      {alert && <Alert color={alert.type}>{alert.message}</Alert>}

      <div className="mb-3">
        <label htmlFor="weekPicker">Select Week:</label>
        <Input
          type="week"
          id="weekPicker"
          value={`${weekNumber.year}-W${weekNumber.week
            .toString()
            .padStart(2, "0")}`}
          onChange={handleWeekChange}
        />
      </div>

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
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day, index) => (
              <tr key={day}>
                <td>{day}</td>
                <td>
                  {workGraphic.workGraphic[index].map((shift, shiftIndex) => (
                    <div key={shiftIndex} className="d-flex mb-2">
                      {editing ? (
                        <>
                          <Input
                            type="time"
                            value={shift.start}
                            onChange={(e) =>
                              handleEditChange(
                                index,
                                shiftIndex,
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
                                index,
                                shiftIndex,
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
                    <Button size="sm" onClick={() => addShift(index)}>
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
  );
};

export default WorkerDashboard;
