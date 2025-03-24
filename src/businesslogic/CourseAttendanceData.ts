import CreateAttendanceCheckModel from "../models/CreateAttendanceCheckModel";
import AttendanceModel from "../models/AttendanceModel";
import { GetUserToken } from "./UserDataOffline";
import axios from "axios";

export async function AddAttendanceCheck(
  model: CreateAttendanceCheckModel
): Promise<boolean | string> {
  const token = await GetUserToken();
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Attendance/AttendanceCheck/Add`,
    {
      studentCode: model.studentCode,
      courseAttendanceId: model.courseAttendanceId,
      workplaceId: model.workplaceId,
      creator: "educode-mobile",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status < 500,
    }
  );

  if (response.status == 200) {
    return true;
  }

  return response.data.error ?? "internet-connection-error";
}

export async function GetCurrentAttendance(
  uniId: string
): Promise<AttendanceModel | string> {
  const token = await GetUserToken();
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/Attendance/CurrentAttendance/UniId/${uniId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status < 500,
    }
  );

  if (response.status == 200) {
    const data = response.data;
    return {
      attendanceId: data.attendanceId,
      courseName: data.courseName,
      courseCode: data.courseCode,
    } as AttendanceModel;
  }

  console.log(response.status);
  console.log(response.data.error);
  return response.data.error ?? "internet-connection-error";
}
