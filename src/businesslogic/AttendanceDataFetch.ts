import CreateAttendanceCheckModel from "../models/CreateAttendanceCheckModel";
import { GetUserToken } from "./UserDataOffline";
import axios from "axios";
import { CourseAttendance, MultipleCourseAttendances } from "../models/CourseAttendanceModel";
import { ConvertDateTimeToDateOnly, ConvertDateTimeToTimeOnly } from "../helpers/DateHandlers";
import AttendanceType from "../models/AttendanceTypeModel";

export async function AddAttendanceCheck(model: CreateAttendanceCheckModel): Promise<boolean | string> {
  const token = await GetUserToken();
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Attendance/AttendanceCheck/Add`,
    {
      studentCode: model.studentCode,
      courseAttendanceId: model.courseAttendanceId,
      workplaceId: model.workplaceId,
      creator: "educode-webapp",
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

export async function GetCurrentAttendance(uniId: string): Promise<CourseAttendance | string> {
  const token = await GetUserToken();
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/Attendance/CurrentAttendance/UniId/${uniId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    validateStatus: (status) => status < 500,
  });

  if (response.status == 200) {
    const data = response.data;
    return {
      courseId: data.course.id,
      courseCode: data.course.courseCode,
      courseName: data.course.courseName,
      attendanceId: data.id,
      attendanceTypeId: data.attendanceTypeId,
      attendanceType: data.attendanceType.attendanceType,
      date: ConvertDateTimeToDateOnly(data.endTime),
      startTime: ConvertDateTimeToTimeOnly(data.startTime),
      endTime: ConvertDateTimeToTimeOnly(data.endTime),
    } as CourseAttendance;
  }

  return response.data.error ?? "internet-connection-error";
}

export async function GetStudentCountByAttendanceId(attendanceId: number): Promise<number | string> {
  const token = await GetUserToken();
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/Attendance/StudentCount/AttendanceId/${attendanceId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      validateStatus: (status) => status < 500,
    }
  );

  if (response.status == 200) {
    const data = response.data;
    return data;
  }

  return response.data.error ?? "internet-connection-error";
}

export async function GetMostRecentAttendance(uniId: string): Promise<CourseAttendance | string> {
  const token = await GetUserToken();
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/Attendance/RecentAttendance/UniId/${uniId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    validateStatus: (status) => status < 500,
  });

  if (response.status == 200) {
    const data = response.data;
    return {
      courseId: data.course.id,
      courseCode: data.course.courseCode,
      courseName: data.course.courseName,
      attendanceId: data.id,
      attendanceTypeId: data.attendanceTypeId,
      attendanceType: data.attendanceType.attendanceType,
      date: ConvertDateTimeToDateOnly(data.endTime),
      startTime: ConvertDateTimeToTimeOnly(data.startTime),
      endTime: ConvertDateTimeToTimeOnly(data.endTime),
    } as CourseAttendance;
  }

  return response.data.error ?? "internet-connection-error";
}

export async function GetAttendanceById(attendanceId: number): Promise<CourseAttendance | string> {
  const token = await GetUserToken();
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/Attendance/Id/${attendanceId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    validateStatus: (status) => status < 500,
  });
  if (response.status == 200) {
    const data = response.data;
    return {
      courseId: data.course.id,
      courseCode: data.course.courseCode,
      courseName: data.course.courseName,
      attendanceId: data.id,
      attendanceTypeId: data.attendanceTypeId,
      attendanceType: data.attendanceType.attendanceType,
      date: ConvertDateTimeToDateOnly(data.endTime),
      startTime: ConvertDateTimeToTimeOnly(data.startTime),
      endTime: ConvertDateTimeToTimeOnly(data.endTime),
    } as CourseAttendance;
  }

  return response.data.error ?? "internet-connection-error";
}

export async function GetAttendanceTypes(): Promise<AttendanceType[] | string> {
  const token = await GetUserToken();
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/Attendance/AttendanceTypes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    validateStatus: (status) => status < 500,
  });
  if (response.status == 200) {
    const data = response.data;
    return data;
  }

  return response.data.error ?? "internet-connection-error";
}

export async function AddAttendances(attendances: MultipleCourseAttendances): Promise<boolean | string> {
  const token = await GetUserToken();
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Attendance/Add`,
    {
      courseId: attendances.courseId,
      attendanceTypeId: attendances.attendanceTypeId,
      startTime: attendances.startTime,
      endTime: attendances.endTime,
      attendanceDates: attendances.dates,
      creator: "educode-webapp",
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
