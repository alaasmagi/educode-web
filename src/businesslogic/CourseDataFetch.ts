import axios from "axios";
import Course from "../models/CourseModel";
import { GetUserToken } from "./UserDataOffline";

export async function GetCoursesByUser(uniId: string): Promise<Course[] | string> {
  const token = await GetUserToken();
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/Course/UniId/${uniId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    validateStatus: (status) => status < 500,
  });
  if (response.status == 200) {
    const courses: Course[] = response.data;
    return courses;
  }
  return response.data.error ?? "internet-connection-error";
}
